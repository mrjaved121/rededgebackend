const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const ChecklistTemplate = require('../models/ChecklistTemplate');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/jobs — list jobs (admin sees all, installer sees own)
router.get('/', auth, async (req, res) => {
  try {
    const { status, system, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    // Role-based filtering
    if (req.user.role === 'installer') {
      filter.$or = [
        { assignedTo: req.user._id },
        { createdBy: req.user._id },
      ];
    }

    if (status && status !== 'all') filter.status = status;
    if (system && system !== 'all') filter.systemType = system;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { jobNumber: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await Job.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    // Compute stats
    const allFilter =
      req.user.role === 'installer'
        ? {
            $or: [
              { assignedTo: req.user._id },
              { createdBy: req.user._id },
            ],
          }
        : {};

    const stats = await Job.aggregate([
      { $match: allFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statMap = {};
    let totalJobs = 0;
    stats.forEach((s) => {
      statMap[s._id] = s.count;
      totalJobs += s.count;
    });

    res.json({
      jobs: jobs.map(formatJob),
      total,
      page: parseInt(page),
      stats: {
        total: totalJobs,
        draft: statMap.draft || 0,
        pending: statMap.pending || 0,
        needs_approval: statMap.needs_approval || 0,
        in_progress: statMap.in_progress || 0,
        completed: statMap.completed || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/jobs/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('steps.photos');

    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.json(formatJob(job));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/jobs — create job (admin or installer)
router.post(
  '/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('systemType').notEmpty().withMessage('System type is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('scheduledDate').notEmpty().withMessage('Scheduled date is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        title,
        description,
        systemType,
        location,
        address,
        scheduledDate,
        company,
        assignedTo,
        mediaAttachments,
      } = req.body;

      // Use custom steps from request, or fallback to template
      let steps = [];
      if (req.body.steps && Array.isArray(req.body.steps) && req.body.steps.length > 0) {
        steps = req.body.steps.map((s, i) => ({
          number: s.number || i + 1,
          title: s.title,
          description: s.description || '',
          requiresPhoto: s.requiresPhoto !== undefined ? s.requiresPhoto : true,
          isCompleted: false,
          notes: '',
          photos: [],
          section: s.section || '',
          inputType: s.inputType || 'checkbox',
          inputLabel: s.inputLabel || '',
          options: s.options || [],
        }));
      } else {
        const template = await ChecklistTemplate.findOne({ systemType });
        if (template) {
          steps = template.steps.map((s) => ({
            number: s.number,
            title: s.title,
            description: s.description,
            requiresPhoto: s.requiresPhoto,
            isCompleted: false,
            notes: '',
            photos: [],
            section: s.section || '',
            inputType: s.inputType || 'checkbox',
            inputLabel: s.inputLabel || '',
            options: s.options || [],
          }));
        }
      }

      const job = await Job.create({
        title,
        description,
        systemType,
        location,
        address,
        scheduledDate: new Date(scheduledDate),
        company,
        createdBy: req.userId,
        assignedTo: assignedTo || null,
        steps,
        mediaAttachments: mediaAttachments || [],
      });

      const populated = await Job.findById(job._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      res.status(201).json(formatJob(populated));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/v1/jobs/:id — update job
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const allowed = [
      'title',
      'description',
      'systemType',
      'location',
      'address',
      'scheduledDate',
      'company',
      'assignedTo',
      'status',
      'mediaAttachments',
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'scheduledDate') {
          job[field] = new Date(req.body[field]);
        } else {
          job[field] = req.body[field];
        }
      }
    });

    // If system type changed, reload checklist template steps
    if (
      req.body.systemType &&
      req.body.systemType !== job.systemType &&
      job.steps.every((s) => !s.isCompleted)
    ) {
      const template = await ChecklistTemplate.findOne({
        systemType: req.body.systemType,
      });
      if (template) {
        job.steps = template.steps.map((s) => ({
          number: s.number,
          title: s.title,
          description: s.description,
          requiresPhoto: s.requiresPhoto,
          isCompleted: false,
          notes: '',
          photos: [],
          section: s.section || '',
          inputType: s.inputType || 'checkbox',
          inputLabel: s.inputLabel || '',
          options: s.options || [],
        }));
      }
    }

    await job.save();

    const populated = await Job.findById(job._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(formatJob(populated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/jobs/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Only admin or creator can delete
    if (
      req.user.role !== 'admin' &&
      job.createdBy.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/v1/jobs/:id/status — approve/reject
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.status = status;
    if (status === 'completed') job.completedAt = new Date();
    await job.save();

    const populated = await Job.findById(job._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(formatJob(populated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/v1/jobs/:id/steps/:stepIndex — complete step
router.patch('/:id/steps/:stepIndex', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const idx = parseInt(req.params.stepIndex);
    if (idx < 0 || idx >= job.steps.length) {
      return res.status(400).json({ error: 'Invalid step index' });
    }

    if (req.body.isCompleted !== undefined) {
      job.steps[idx].isCompleted = req.body.isCompleted;
      if (req.body.isCompleted) job.steps[idx].completedAt = new Date();
    }
    if (req.body.notes !== undefined) {
      job.steps[idx].notes = req.body.notes;
    }
    if (req.body.inputValue !== undefined) {
      job.steps[idx].inputValue = req.body.inputValue;
    }

    // Update job status based on steps
    const allDone = job.steps.every((s) => s.isCompleted);
    const anyDone = job.steps.some((s) => s.isCompleted);
    if (allDone) {
      job.status = 'needs_approval';
    } else if (anyDone) {
      job.status = 'in_progress';
    }

    await job.save();

    const populated = await Job.findById(job._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(formatJob(populated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function formatJob(job) {
  const completedSteps = job.steps.filter((s) => s.isCompleted).length;
  return {
    id: job._id,
    jobNumber: job.jobNumber,
    title: job.title,
    description: job.description,
    status: job.status,
    systemType: job.systemType,
    location: job.location,
    address: job.address,
    scheduledDate: job.scheduledDate,
    company: job.company,
    createdBy: job.createdBy,
    assignedTo: job.assignedTo,
    steps: job.steps.map((s, i) => ({
      id: s._id || `step-${i}`,
      number: s.number,
      title: s.title,
      description: s.description,
      requiresPhoto: s.requiresPhoto,
      isCompleted: s.isCompleted,
      notes: s.notes,
      photos: s.photos,
      completedAt: s.completedAt,
      section: s.section || '',
      inputType: s.inputType || 'checkbox',
      inputLabel: s.inputLabel || '',
      inputValue: s.inputValue || '',
      options: s.options || [],
    })),
    mediaAttachments: job.mediaAttachments,
    completedSteps,
    totalSteps: job.steps.length,
    completedAt: job.completedAt,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

module.exports = router;
