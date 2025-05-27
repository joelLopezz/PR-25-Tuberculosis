// routes/referralRoutes.js
const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { auth, isMedicalStaff } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.get('/', auth, referralController.getAllReferrals);
router.post('/', auth, isMedicalStaff, referralController.createReferral);
router.get('/:id', auth, referralController.getReferralById);
router.put('/:id/status', auth, isMedicalStaff, referralController.updateReferralStatus);
router.delete('/:id', auth, isMedicalStaff, referralController.deleteReferral);
// ⭐ NUEVAS RUTAS: Para manejo de historial de hospitales
router.get('/patient/:patientId/hospital-history', auth, referralController.getPatientHospitalHistory);
router.get('/patient/:patientId/available-hospitals', auth, referralController.getAvailableHospitalsForReferral);

module.exports = router;