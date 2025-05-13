// routes/counterReferenceRoutes.js
const express = require('express');
const router = express.Router();
const counterReferenceController = require('../controllers/counterReferenceController');
const { auth, isMedicalStaff } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.get('/', auth, counterReferenceController.getAllCounterReferences);
router.post('/', auth, isMedicalStaff, counterReferenceController.createCounterReference);
router.get('/:id', auth, counterReferenceController.getCounterReferenceById);
router.put('/:id', auth, isMedicalStaff, counterReferenceController.updateCounterReference);
router.delete('/:id', auth, isMedicalStaff, counterReferenceController.deleteCounterReference);

module.exports = router;