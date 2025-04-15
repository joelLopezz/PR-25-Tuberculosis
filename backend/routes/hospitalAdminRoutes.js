// routes/hospitalAdminRoutes.js
const express = require('express');
const router = express.Router();
const hospitalAdminController = require('../controllers/hospitalAdminController');
const { auth, isSedesAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

// Rutas protegidas (requieren autenticación y roles específicos)
router.get('/', auth, isSedesAdmin, hospitalAdminController.getAllHospitalAdmins);
router.get('/:id', auth, isSedesAdmin, hospitalAdminController.getHospitalAdminById);
router.post('/', auth, isSedesAdmin, hospitalAdminController.createHospitalAdmin);
router.put('/:id', auth, isSedesAdmin, hospitalAdminController.updateHospitalAdmin);
router.delete('/:id', auth, isSedesAdmin, hospitalAdminController.deleteHospitalAdmin);
router.post('/:id/reset-password', auth, isSedesAdmin, hospitalAdminController.resetPassword);

module.exports = router;