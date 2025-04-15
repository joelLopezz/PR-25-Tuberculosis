//routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

// Ruta: POST /api/auth/login
router.post('/login', [
  check('identifier', 'Por favor incluya un identificador válido').not().isEmpty(),
  check('password', 'La contraseña es obligatoria').not().isEmpty()
], authController.login);

// Ruta: GET /api/auth/user
router.get('/user', auth, authController.getUser);

// Rutas para recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);
router.get('/verify-reset-token/:token', authController.verifyResetToken);
router.post('/reset-password', [
  check('token', 'El token es obligatorio').not().isEmpty(),
  check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 })
], authController.resetPassword);

module.exports = router;