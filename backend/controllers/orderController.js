const Order = require('../models/orderModel');

exports.createOrder = (req, res) => {
    const { cart, address, creditCard } = req.body;

    if (!cart || !address || !creditCard) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    try {
        const parsedCart = JSON.stringify(cart); // Asegúrate de que el carrito se puede convertir a JSON
        const newOrder = { address, creditCard, cart: parsedCart };

        Order.create(newOrder, (err, result) => {
            if (err) {
                return res.status(500).send({ message: err.message || 'Some error occurred while creating the order.' });
            }
            res.send({ message: 'Order created successfully!', orderId: result.id });
        });
    } catch (error) {
        return res.status(500).send({ message: 'Failed to process cart data.' });
    }
};
