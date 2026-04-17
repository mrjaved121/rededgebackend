const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    stepId: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filePath: { type: String, required: true },
    fileId: { type: String },
    thumbnailUrl: { type: String },
    fileName: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String },
    annotation: { type: String, default: '' },
    capturedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Photo', photoSchema);
