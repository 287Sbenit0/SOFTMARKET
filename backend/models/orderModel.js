const sql = require('../config/db');

const Order = function(order) {
    this.address = order.address;
    this.creditCard = order.creditCard;
    this.cart = JSON.stringify(order.cart); // Convertir el carrito a JSON
};

Order.create = (newOrder, result) => {
    sql.query('INSERT INTO orders SET ?', newOrder, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newOrder });
    });
};

module.exports = Order;
