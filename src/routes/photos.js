const express = require('express');
const fs = require('fs');
const Photo = require('../models/Photo');
const Job = require('../models/Job');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const imagekit = require('../middleware/imagekit');

const router = express.Router();

// POST /api/v1/photos/upload — upload photo file + metadata
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('[PHOTO UPLOAD] Request received');
    console.log('[PHOTO UPLOAD] Body:', JSON.stringify(req.body));
    console.log('[PHOTO UPLOAD] File:', req.file ? { originalname: req.file.originalname, size: req.file.size, path: req.file.path } : 'NO FILE');

    if (!req.file) {
      console.log('[PHOTO UPLOAD] ERROR: No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { jobId, stepId, latitude, longitude, address, annotation } = req.body;

    // Upload to ImageKit
    console.log('[PHOTO UPLOAD] Uploading to ImageKit...');
    const fileBuffer = fs.readFileSync(req.file.path);
    const ikResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.originalname,
      folder: `/rededge/jobs/${jobId || 'unassigned'}`,
      tags: [jobId, stepId].filter(Boolean),
    });
    console.log('[PHOTO UPLOAD] ImageKit response:', { url: ikResponse.url, fileId: ikResponse.fileId, thumbnailUrl: ikResponse.thumbnailUrl });

    // Remove local temp file after upload
    fs.unlink(req.file.path, () => {});

    const photo = await Photo.create({
      jobId,
      stepId,
      uploadedBy: req.userId,
      filePath: ikResponse.url,
      fileId: ikResponse.fileId,
      thumbnailUrl: ikResponse.thumbnailUrl,
      fileName: req.file.originalname,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      address: address || undefined,
      annotation,
    });

    // Add photo reference to job step & auto-mark step as completed
    if (jobId && stepId) {
      const job = await Job.findById(jobId);
      if (job) {
        const step = job.steps.id(stepId);
        if (step) {
          step.photos.push(photo._id);
          // Auto-mark step as completed when photo is uploaded
          if (!step.isCompleted) {
            step.isCompleted = true;
            step.completedAt = new Date();
          }
          // Update job status based on steps
          const allDone = job.steps.every((s) => s.isCompleted);
          const anyDone = job.steps.some((s) => s.isCompleted);
          if (allDone) {
            job.status = 'needs_approval';
          } else if (anyDone && job.status === 'pending') {
            job.status = 'in_progress';
          }
          await job.save();
        }
      }
    }

    console.log('[PHOTO UPLOAD] Photo saved to DB:', photo._id);
    res.status(201).json({
      id: photo._id,
      filePath: photo.filePath,
      fileId: photo.fileId,
      thumbnailUrl: photo.thumbnailUrl,
      fileName: photo.fileName,
      latitude: photo.latitude,
      longitude: photo.longitude,
      address: photo.address,
      annotation: photo.annotation,
      capturedAt: photo.capturedAt,
    });
  } catch (err) {
    console.error('[PHOTO UPLOAD] ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/photos?jobId=&stepId=
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.jobId) filter.jobId = req.query.jobId;
    if (req.query.stepId) filter.stepId = req.query.stepId;

    const photos = await Photo.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ capturedAt: -1 });

    res.json({
      photos: photos.map((p) => ({
        id: p._id,
        jobId: p.jobId,
        stepId: p.stepId,
        filePath: p.filePath,
        fileId: p.fileId,
        thumbnailUrl: p.thumbnailUrl,
        fileName: p.fileName,
        latitude: p.latitude,
        longitude: p.longitude,
        annotation: p.annotation,
        capturedAt: p.capturedAt,
        uploadedBy: p.uploadedBy,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/photos/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    // Delete from ImageKit if fileId exists
    if (photo.fileId) {
      try {
        await imagekit.deleteFile(photo.fileId);
      } catch (_) {
        // Continue even if ImageKit delete fails
      }
    }

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
