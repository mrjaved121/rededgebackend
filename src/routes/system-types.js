const express = require('express');
const { body, validationResult } = require('express-validator');
const SystemType = require('../models/SystemType');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/system-types — list all system types
router.get('/', auth, async (req, res) => {
  try {
    const types = await SystemType.find().sort({ name: 1 });
    res.json({
      systemTypes: types.map((t) => ({
        id: t._id,
        name: t.name,
        createdAt: t.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/system-types — create (admin only)
router.post(
  '/',
  auth,
  adminOnly,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existing = await SystemType.findOne({ name: req.body.name });
      if (existing) {
        return res.status(409).json({ error: 'System type already exists' });
      }

      const systemType = await SystemType.create({
        name: req.body.name,
        createdBy: req.userId,
      });

      res.status(201).json({
        id: systemType._id,
        name: systemType.name,
        createdAt: systemType.createdAt,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/v1/system-types/:id — delete (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const type = await SystemType.findById(req.params.id);
    if (!type) return res.status(404).json({ error: 'System type not found' });

    await SystemType.findByIdAndDelete(req.params.id);
    res.json({ message: 'System type deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
