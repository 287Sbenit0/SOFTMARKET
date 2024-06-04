//Falta implementar todo orders

const Order = require('../models/orderModel');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
    }

    const order = new Order({
        name: req.body.name,
        address: req.body.address,
        card: req.body.card,
        cart: req.body.cart,
        userId: req.userId, // Extraido del token
    });

    Order.create(order, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the order.',
            });
        else res.send({ success: true });
    });
};
