const sql = require('../config/db');

const Product = function(product) {
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.offer_status = product.offer_status;
    this.created_at = product.created_at;
    this.image_url = product.image_url;
};

Product.getAll = result => {
    sql.query('SELECT * FROM products', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Product.getRecent = result => {
    sql.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 12', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Product.getOffers = result => {
    sql.query('SELECT * FROM products WHERE offer_status = 1 ORDER BY created_at DESC LIMIT 12', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Product.getCheapest = result => {
    sql.query('SELECT * FROM products ORDER BY price ASC LIMIT 12', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

module.exports = Product;
