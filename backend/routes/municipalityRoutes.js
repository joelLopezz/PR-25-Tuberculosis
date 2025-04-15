// routes/municipalityRoutes.js
const express = require('express');
const router = express.Router();
const municipalityController = require('../controllers/municipalityController');

// Rutas para municipios (solo lectura)
router.get('/', municipalityController.getAllMunicipalities);
router.get('/:id', municipalityController.getMunicipalityById);

module.exports = router;