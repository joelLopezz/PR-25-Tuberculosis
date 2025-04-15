// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/authMiddleware');

// Rutas protegidas que requieren autenticación y rol admin
router.get('/', auth, isAdmin, userController.getAllUsers);
router.post('/', auth, isAdmin, userController.createUser);
router.put('/:id', auth, isAdmin, userController.updateUser);
router.put('/:id/change-password', auth, isAdmin, userController.changePassword);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router;