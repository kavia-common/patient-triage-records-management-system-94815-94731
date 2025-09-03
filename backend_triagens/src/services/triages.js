'use strict';
const Triage = require('../models/triage');

/**
 * PUBLIC_INTERFACE
 * Triage service to encapsulate DB operations.
 */
module.exports = {
  async list(filter = {}, { page = 1, limit = 20, sort = '-triagedAt' } = {}) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Triage.find(filter).sort(sort).skip(skip).limit(limit).populate('patient').lean().exec(),
      Triage.countDocuments(filter),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  },

  async create(data) {
    const triage = new Triage(data);
    return triage.save();
  },

  async getById(id) {
    return Triage.findById(id).populate('patient').lean().exec();
  },

  async updateById(id, data) {
    return Triage.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .populate('patient')
      .lean()
      .exec();
  },

  async deleteById(id) {
    return Triage.findByIdAndDelete(id).lean().exec();
  },
};
