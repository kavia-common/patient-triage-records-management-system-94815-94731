'use strict';
const express = require('express');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { controller, validators } = require('../controllers/triages');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Triages
 *   description: Triage CRUD operations
 */

/**
 * @swagger
 * /triages:
 *   get:
 *     summary: List triages
 *     tags: [Triages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: patient
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [waiting, in_treatment, discharged] }
 *     responses:
 *       200:
 *         description: Triages list
 */
router.get('/', auth(false), validators.list, validate, controller.list.bind(controller));

/**
 * @swagger
 * /triages:
 *   post:
 *     summary: Create a triage
 *     tags: [Triages]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Triage created
 */
router.post('/', auth(true), validators.create, validate, controller.create.bind(controller));

/**
 * @swagger
 * /triages/{id}:
 *   get:
 *     summary: Get a triage by id
 *     tags: [Triages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: A triage
 *       404:
 *         description: Not found
 */
router.get('/:id', auth(false), validators.idParam, validate, controller.get.bind(controller));

/**
 * @swagger
 * /triages/{id}:
 *   put:
 *     summary: Update a triage
 *     tags: [Triages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Updated triage
 *       404:
 *         description: Not found
 */
router.put('/:id', auth(true), [...validators.idParam, ...validators.update], validate, controller.update.bind(controller));

/**
 * @swagger
 * /triages/{id}:
 *   delete:
 *     summary: Delete a triage
 *     tags: [Triages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted triage
 *       404:
 *         description: Not found
 */
router.delete('/:id', auth(true), validators.idParam, validate, controller.remove.bind(controller));

module.exports = router;
