// routes/networkRoutes.js
const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');

// Rutas para redes de salud
router.get('/', networkController.getAllNetworks);
router.get('/:id', networkController.getNetworkById);
router.post('/', networkController.createNetwork);
router.put('/:id', networkController.updateNetwork);
router.delete('/:id', networkController.deleteNetwork);

module.exports = router;