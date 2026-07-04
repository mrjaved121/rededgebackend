const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const ExcelJS = require('exceljs');
const ChecklistTemplate = require('../models/ChecklistTemplate');
const Job = require('../models/Job');
const { auth, adminOnly } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// GET /api/v1/checklists — all templates
router.get('/', auth, async (req, res) => {
  try {
    const templates = await ChecklistTemplate.find()
      .populate('createdBy', 'name email')
      .sort({ name: 1 });

    res.json({ templates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/checklists/:systemType/export — download template as Excel
router.get('/:systemType/export', auth, adminOnly, async (req, res) => {
  try {
    const template = await ChecklistTemplate.findOne({ systemType: req.params.systemType });
    if (!template) return res.status(404).json({ error: 'Checklist template not found' });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Steps');

    sheet.columns = [
      { header: 'number', key: 'number', width: 10 },
      { header: 'section', key: 'section', width: 20 },
      { header: 'title', key: 'title', width: 40 },
      { header: 'description', key: 'description', width: 40 },
      { header: 'inputType', key: 'inputType', width: 15 },
      { header: 'inputLabel', key: 'inputLabel', width: 20 },
      { header: 'options', key: 'options', width: 30 },
      { header: 'requiresPhoto', key: 'requiresPhoto', width: 15 },
    ];

    // Bold header row
    sheet.getRow(1).font = { bold: true };

    template.steps.forEach((step) => {
      sheet.addRow({
        number: step.number,
        section: step.section || '',
        title: step.title,
        description: step.description || '',
        inputType: step.inputType || 'checkbox',
        inputLabel: step.inputLabel || '',
        options: (step.options || []).join('|'),
        requiresPhoto: step.requiresPhoto ? 'true' : 'false',
      });
    });

    const safeName = template.name.replace(/[^a-z0-9]/gi, '_');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/checklists/:systemType/import — upload Excel to update template
router.post('/:systemType/import', auth, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const template = await ChecklistTemplate.findOne({ systemType: req.params.systemType });
    if (!template) return res.status(404).json({ error: 'Checklist template not found' });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];

    const steps = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      const [number, section, title, description, inputType, inputLabel, options, requiresPhoto] = row.values.slice(1);
      if (!title) return; // skip empty rows
      steps.push({
        number: Number(number) || rowNumber - 1,
        section: section || '',
        title: String(title),
        description: description ? String(description) : '',
        inputType: inputType || 'checkbox',
        inputLabel: inputLabel ? String(inputLabel) : '',
        options: options ? String(options).split('|').filter(Boolean) : [],
        requiresPhoto: String(requiresPhoto).toLowerCase() === 'true',
      });
    });

    if (steps.length === 0) return res.status(400).json({ error: 'Excel file has no valid steps' });

    template.steps = steps;
    await template.save();

    res.json({ message: `Updated ${steps.length} steps for "${template.name}"`, template });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/v1/checklists/:systemType/rename — rename a machine everywhere,
// including any existing jobs that reference the old systemType (admin only)
router.patch(
  '/:systemType/rename',
  auth,
  adminOnly,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const oldSystemType = req.params.systemType;
      const newName = req.body.name;

      const template = await ChecklistTemplate.findOne({ systemType: oldSystemType });
      if (!template) return res.status(404).json({ error: 'Checklist template not found' });

      if (newName !== oldSystemType) {
        const conflict = await ChecklistTemplate.findOne({ systemType: newName });
        if (conflict) return res.status(409).json({ error: 'A machine with that name already exists' });
      }

      template.systemType = newName;
      template.name = newName;
      await template.save();

      const jobsResult = await Job.updateMany({ systemType: oldSystemType }, { systemType: newName });

      res.json({ template, jobsUpdated: jobsResult.modifiedCount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

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
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
      console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
