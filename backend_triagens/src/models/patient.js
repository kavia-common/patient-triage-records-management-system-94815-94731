'use strict';
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  lastName: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other', 'unknown'], default: 'unknown' },
  contactNumber: { type: String, trim: true },
  address: { type: String, trim: true, maxlength: 500 },
  medicalRecordNumber: { type: String, unique: true, sparse: true, trim: true, maxlength: 50 },
}, {
  timestamps: true,
});

PatientSchema.index({ lastName: 1, firstName: 1 });
PatientSchema.index({ medicalRecordNumber: 1 }, { unique: true, sparse: true });

/**
 * PUBLIC_INTERFACE
 * Patient mongoose model
 */
module.exports = mongoose.model('Patient', PatientSchema);
