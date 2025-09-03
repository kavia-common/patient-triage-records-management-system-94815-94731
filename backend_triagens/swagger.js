const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient Triage Records API',
      version: '1.0.0',
      description: 'REST API for managing patients and triage records in a hospital setting',
    },
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Patients', description: 'Patient CRUD' },
      { name: 'Triages', description: 'Triage CRUD' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
