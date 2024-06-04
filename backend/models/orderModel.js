const sql = require('../config/db');

const Order = function(order) {
    this.name = order.name;
    this.address = order.address;
    this.card = order.card;
    this.cart = JSON.stringify(order.cart);
    this.userId = order.userId;
};

Order.create = (newOrder, result) => {
    sql.query('INSERT INTO orders SET ?', newOrder, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        console.log('created order: ', { id: res.insertId, ...newOrder });
        result(null, { id: res.insertId, ...newOrder });
    });
};

module.exports = Order;
