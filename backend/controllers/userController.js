const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.register = (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.create(newUser, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || 'Some error occurred while registering the user.'
            });
        } else {
            res.send(data);
        }
    });
};

exports.login = (req, res) => {
    User.findByEmail(req.body.email, (err, user) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({
                    message: `Not found User with email ${req.body.email}.`
                });
            } else {
                res.status(500).send({
                    message: 'Error retrieving User with email ' + req.body.email
                });
            }
        } else {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    res.status(401).send({
                        message: 'Invalid Password!'
                    });
                } else {
                    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
                        expiresIn: 86400 // 24 horas
                    });
                    res.send({
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        accessToken: token
                    });
                }
            });
        }
    });
};
