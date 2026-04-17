const express = require('express');
const { body, validationResult } = require('express-validator');
const ChecklistTemplate = require('../models/ChecklistTemplate');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/checklists — all templates
router.get('/', auth, async (req, res) => {
  try {
    const templates = await ChecklistTemplate.find()
      .populate('createdBy', 'name email')
      .sort({ name: 1 });

    res.json({ templates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/checklists/:systemType — single template by system type
router.get('/:systemType', auth, async (req, res) => {
  try {
    const template = await ChecklistTemplate.findOne({
      systemType: req.params.systemType,
    });

    if (!template) {
      return res.status(404).json({ error: 'Checklist template not found' });
    }

    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/checklists — create/update template (admin only)
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('systemType').notEmpty().withMessage('System type is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('steps').isArray({ min: 1 }).withMessage('At least one step is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { systemType, name, steps } = req.body;

      // Upsert — update if exists, create if not
      const template = await ChecklistTemplate.findOneAndUpdate(
        { systemType },
        {
          systemType,
          name,
          steps: steps.map((s, i) => ({
            number: s.number || i + 1,
            title: s.title,
            description: s.description || '',
            requiresPhoto: s.requiresPhoto || false,
            section: s.section || '',
            inputType: s.inputType || 'checkbox',
            inputLabel: s.inputLabel || '',
            options: s.options || [],
          })),
          createdBy: req.userId,
        },
        { upsert: true, new: true, runValidators: true }
      );

      res.status(201).json(template);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/v1/checklists/:systemType — (admin only)
router.delete('/:systemType', auth, adminOnly, async (req, res) => {
  try {
    await ChecklistTemplate.findOneAndDelete({
      systemType: req.params.systemType,
    });
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
