const Product = require('../models/productModel');

exports.getRecentProducts = (req, res) => {
    Product.getRecent((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving recent products.'
            });
        } else {
            res.send(data);
        }
    });
};

exports.getOfferProducts = (req, res) => {
    Product.getOffers((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving offer products.'
            });
        } else {
            res.send(data);
        }
    });
};

exports.getCheapestProducts = (req, res) => {
    Product.getCheapest((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving cheapest products.'
            });
        } else {
            res.send(data);
        }
    });
};

exports.getAllProducts = (req, res) => {
    Product.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving products.'
            });
        } else {
            res.send(data);
        }
    });
};
