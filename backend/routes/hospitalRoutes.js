const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

// Rutas para hospitales
router.get('/', hospitalController.getAllHospitals);          // Obtener todos
router.get('/:id', hospitalController.getHospitalById);       // Obtener uno por ID
router.post('/', hospitalController.createHospital);          // Crear
router.put('/:id', hospitalController.updateHospital);        // Actualizar
router.delete('/:id', hospitalController.deleteHospital);     // Eliminación lógica

module.exports = router;
