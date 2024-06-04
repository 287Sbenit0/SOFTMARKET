const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authJwt');

router.post('/', verifyToken, orderController.create);

module.exports = router;
