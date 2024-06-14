const sql = require('../config/db');
const bcrypt = require('bcryptjs');

const User = function(user) {
    this.email = user.email;
    this.password = user.password;
    this.role = user.role || 'user';
};

User.create = (newUser, result) => {
    bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        newUser.password = hash;
        sql.query('INSERT INTO users SET ?', newUser, (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
            result(null, { id: res.insertId, ...newUser });
        });
    });
};

User.findByEmail = (email, result) => {
    sql.query('SELECT * FROM users WHERE email = ?', [email], (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: 'not_found' }, null);
    });
};

module.exports = User;
