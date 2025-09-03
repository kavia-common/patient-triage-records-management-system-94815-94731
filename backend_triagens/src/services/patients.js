'use strict';
const Patient = require('../models/patient');

/**
 * PUBLIC_INTERFACE
 * Patient service to encapsulate DB operations.
 */
module.exports = {
  async list(filter = {}, { page = 1, limit = 20, sort = '-createdAt' } = {}) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Patient.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
      Patient.countDocuments(filter),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  },

  async create(data) {
    const patient = new Patient(data);
    return patient.save();
  },

  async getById(id) {
    return Patient.findById(id).lean().exec();
  },

  async updateById(id, data) {
    return Patient.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean().exec();
  },

  async deleteById(id) {
    return Patient.findByIdAndDelete(id).lean().exec();
  },
};
