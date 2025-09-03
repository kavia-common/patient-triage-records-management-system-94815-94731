'use strict';
const { body, param, query } = require('express-validator');
const triagesService = require('../services/triages');

/**
 * PUBLIC_INTERFACE
 * Validation rules for triage endpoints.
 */
const validators = {
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
    query('patient').optional().isMongoId(),
    query('status').optional().isIn(['waiting', 'in_treatment', 'discharged']),
  ],
  create: [
    body('patient').isMongoId(),
    body('severity').isIn(['low', 'medium', 'high', 'critical']),
    body('reason').isString().trim().notEmpty(),
    body('notes').optional().isString().trim().isLength({ max: 2000 }),
    body('vitals').optional().isObject(),
    body('vitals.heartRate').optional().isFloat({ min: 0, max: 400 }),
    body('vitals.bloodPressureSystolic').optional().isFloat({ min: 0, max: 400 }),
    body('vitals.bloodPressureDiastolic').optional().isFloat({ min: 0, max: 300 }),
    body('vitals.respiratoryRate').optional().isFloat({ min: 0, max: 200 }),
    body('vitals.temperatureC').optional().isFloat({ min: 25, max: 45 }),
    body('vitals.oxygenSaturation').optional().isFloat({ min: 0, max: 100 }),
    body('status').optional().isIn(['waiting', 'in_treatment', 'discharged']),
    body('attendedBy').optional().isString().trim().isLength({ max: 100 }),
    body('triagedAt').optional().isISO8601().toDate(),
  ],
  idParam: [param('id').isMongoId().withMessage('Invalid triage id')],
  update: [
    body('patient').optional().isMongoId(),
    body('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
    body('reason').optional().isString().trim().notEmpty(),
    body('notes').optional().isString().trim().isLength({ max: 2000 }),
    body('vitals').optional().isObject(),
    body('vitals.heartRate').optional().isFloat({ min: 0, max: 400 }),
    body('vitals.bloodPressureSystolic').optional().isFloat({ min: 0, max: 400 }),
    body('vitals.bloodPressureDiastolic').optional().isFloat({ min: 0, max: 300 }),
    body('vitals.respiratoryRate').optional().isFloat({ min: 0, max: 200 }),
    body('vitals.temperatureC').optional().isFloat({ min: 25, max: 45 }),
    body('vitals.oxygenSaturation').optional().isFloat({ min: 0, max: 100 }),
    body('status').optional().isIn(['waiting', 'in_treatment', 'discharged']),
    body('attendedBy').optional().isString().trim().isLength({ max: 100 }),
    body('triagedAt').optional().isISO8601().toDate(),
  ],
};

/**
 * PUBLIC_INTERFACE
 * Triages Controller with CRUD handlers.
 */
class TriagesController {
  async list(req, res, next) {
    try {
      const { page = 1, limit = 20, patient, status } = req.query;
      const filter = {};
      if (patient) filter.patient = patient;
      if (status) filter.status = status;
      const result = await triagesService.list(filter, { page: Number(page), limit: Number(limit) });
      res.json({ status: 'ok', ...result });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const created = await triagesService.create(req.body);
      res.status(201).json({ status: 'ok', item: created });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const item = await triagesService.getById(req.params.id);
      if (!item) return res.status(404).json({ status: 'error', message: 'Triage not found' });
      res.json({ status: 'ok', item });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await triagesService.updateById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Triage not found' });
      res.json({ status: 'ok', item: updated });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const deleted = await triagesService.deleteById(req.params.id);
      if (!deleted) return res.status(404).json({ status: 'error', message: 'Triage not found' });
      res.json({ status: 'ok', item: deleted });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = {
  controller: new TriagesController(),
  validators,
};
