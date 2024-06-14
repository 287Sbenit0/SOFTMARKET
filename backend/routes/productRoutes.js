const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas para obtener los productos
router.get('/recent', productController.getRecentProducts);
router.get('/offers', productController.getOfferProducts);
router.get('/cheapest', productController.getCheapestProducts);
router.get('/', productController.getAllProducts); // Ruta para obtener todos los productos

module.exports = router;
