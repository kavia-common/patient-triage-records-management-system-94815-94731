'use strict';
const express = require('express');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { controller, validators } = require('../controllers/patients');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient CRUD operations
 */

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: List patients
 *     tags: [Patients]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Patients list
 */
router.get('/', auth(false), validators.list, validate, controller.list.bind(controller));

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Patient created
 */
router.post('/', auth(true), validators.create, validate, controller.create.bind(controller));

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient by id
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: A patient
 *       404:
 *         description: Not found
 */
router.get('/:id', auth(false), validators.idParam, validate, controller.get.bind(controller));

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Updated patient
 *       404:
 *         description: Not found
 */
router.put('/:id', auth(true), [...validators.idParam, ...validators.update], validate, controller.update.bind(controller));

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted patient
 *       404:
 *         description: Not found
 */
router.delete('/:id', auth(true), validators.idParam, validate, controller.remove.bind(controller));

module.exports = router;
