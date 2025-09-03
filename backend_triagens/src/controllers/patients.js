'use strict';
const { body, param, query } = require('express-validator');
const patientsService = require('../services/patients');

/**
 * PUBLIC_INTERFACE
 * Validation rules for patient endpoints.
 */
const validators = {
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
    query('search').optional().isString().trim(),
  ],
  create: [
    body('firstName').isString().trim().notEmpty(),
    body('lastName').isString().trim().notEmpty(),
    body('dateOfBirth').isISO8601().toDate(),
    body('gender').optional().isIn(['male', 'female', 'other', 'unknown']),
    body('contactNumber').optional().isString().trim(),
    body('address').optional().isString().isLength({ max: 500 }).trim(),
    body('medicalRecordNumber').optional().isString().isLength({ max: 50 }).trim(),
  ],
  idParam: [param('id').isMongoId().withMessage('Invalid patient id')],
  update: [
    body('firstName').optional().isString().trim().notEmpty(),
    body('lastName').optional().isString().trim().notEmpty(),
    body('dateOfBirth').optional().isISO8601().toDate(),
    body('gender').optional().isIn(['male', 'female', 'other', 'unknown']),
    body('contactNumber').optional().isString().trim(),
    body('address').optional().isString().isLength({ max: 500 }).trim(),
    body('medicalRecordNumber').optional().isString().isLength({ max: 50 }).trim(),
  ],
};

/**
 * PUBLIC_INTERFACE
 * Patients Controller with CRUD handlers.
 */
class PatientsController {
  async list(req, res, next) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const filter = {};
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { medicalRecordNumber: { $regex: search, $options: 'i' } },
        ];
      }
      const result = await patientsService.list(filter, { page: Number(page), limit: Number(limit) });
      res.json({ status: 'ok', ...result });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const created = await patientsService.create(req.body);
      res.status(201).json({ status: 'ok', item: created });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const item = await patientsService.getById(req.params.id);
      if (!item) return res.status(404).json({ status: 'error', message: 'Patient not found' });
      res.json({ status: 'ok', item });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await patientsService.updateById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Patient not found' });
      res.json({ status: 'ok', item: updated });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const deleted = await patientsService.deleteById(req.params.id);
      if (!deleted) return res.status(404).json({ status: 'error', message: 'Patient not found' });
      res.json({ status: 'ok', item: deleted });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = {
  controller: new PatientsController(),
  validators,
};
