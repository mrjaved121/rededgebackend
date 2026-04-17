const mongoose = require('mongoose');

const checklistStepSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  requiresPhoto: { type: Boolean, default: false },
  section: { type: String, default: '' },
  inputType: { type: String, enum: ['checkbox', 'text', 'number', 'select', 'photo', 'section_header'], default: 'checkbox' },
  inputLabel: { type: String, default: '' },
  options: [{ type: String }],
});

const checklistTemplateSchema = new mongoose.Schema(
  {
    systemType: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    steps: [checklistStepSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChecklistTemplate', checklistTemplateSchema);
