// routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { auth, isMedicalStaff } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.get('/', auth, patientController.getAllPatients);
router.post('/', auth, isMedicalStaff, patientController.createPatient);
router.get('/:id', auth, patientController.getPatientById);
router.put('/:id', auth, isMedicalStaff, patientController.updatePatient);
router.delete('/:id', auth, isMedicalStaff, patientController.deletePatient);

module.exports = router;