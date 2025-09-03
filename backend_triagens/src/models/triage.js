'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TriageSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  reason: { type: String, required: true, trim: true, maxlength: 1000 },
  notes: { type: String, trim: true, maxlength: 2000 },
  vitals: {
    heartRate: { type: Number, min: 0, max: 400 },
    bloodPressureSystolic: { type: Number, min: 0, max: 400 },
    bloodPressureDiastolic: { type: Number, min: 0, max: 300 },
    respiratoryRate: { type: Number, min: 0, max: 200 },
    temperatureC: { type: Number, min: 25, max: 45 },
    oxygenSaturation: { type: Number, min: 0, max: 100 },
  },
  status: { type: String, enum: ['waiting', 'in_treatment', 'discharged'], default: 'waiting' },
  attendedBy: { type: String, trim: true, maxlength: 100 },
  triagedAt: { type: Date, default: Date.now, index: true },
}, {
  timestamps: true,
});

TriageSchema.index({ status: 1, triagedAt: -1 });

/**
 * PUBLIC_INTERFACE
 * Triage mongoose model
 */
module.exports = mongoose.model('Triage', TriageSchema);
