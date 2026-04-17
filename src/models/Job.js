const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  requiresPhoto: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
  completedAt: { type: Date },
  section: { type: String, default: '' },
  inputType: { type: String, enum: ['checkbox', 'text', 'number', 'select', 'photo', 'section_header'], default: 'checkbox' },
  inputLabel: { type: String, default: '' },
  inputValue: { type: String, default: '' },
  options: [{ type: String }],
});

const jobSchema = new mongoose.Schema(
  {
    jobNumber: { type: String, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'pending', 'in_progress', 'completed', 'needs_approval'],
      default: 'draft',
    },
    systemType: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, default: '' },
    scheduledDate: { type: Date, required: true },
    company: { type: String, default: '' },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    steps: [stepSchema],
    mediaAttachments: [{ type: String }], // file paths
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate job number
jobSchema.pre('save', async function (next) {
  if (!this.jobNumber) {
    const lastJob = await mongoose.model('Job')
      .findOne({}, { jobNumber: 1 })
      .sort({ jobNumber: -1 });
    let nextNum = 1;
    if (lastJob && lastJob.jobNumber) {
      const match = lastJob.jobNumber.match(/JOB-(\d+)/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    this.jobNumber = `JOB-${String(nextNum).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Job', jobSchema);
