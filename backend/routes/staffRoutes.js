// routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { auth, isAdmin, isMedicalStaff } = require('../middleware/authMiddleware');

// Rutas públicas (ninguna)

// Rutas protegidas (requieren autenticación)
router.get('/', auth, staffController.getAllStaff);
router.get('/:id', auth, staffController.getStaffById);

// Rutas que requieren rol de administrador
router.post('/', auth, isAdmin, staffController.createStaff);
router.put('/:id', auth, isAdmin, staffController.updateStaff);
router.delete('/:id', auth, isAdmin, staffController.deleteStaff);
router.post('/:staff_id/reset-password', auth, isAdmin, staffController.resetPassword);

// Ruta para cambiar contraseña (cualquier usuario autenticado puede cambiar su propia contraseña)
router.post('/change-password', auth, staffController.changePassword);

module.exports = router;