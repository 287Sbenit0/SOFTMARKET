const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Ruta para el checkout
router.post('/checkout', orderController.createOrder);

module.exports = router;
