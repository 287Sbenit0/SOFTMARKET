const sql = require('../config/db');

const Ticket = function(ticket) {
    this.email = ticket.email;
    this.message = ticket.message;
    this.status = ticket.status || 'open';
};

Ticket.create = (newTicket, result) => {
    sql.query('INSERT INTO tickets SET ?', newTicket, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        console.log('created ticket: ', { id: res.insertId, ...newTicket });
        result(null, { id: res.insertId, ...newTicket });
    });
};

Ticket.getAll = result => {
    sql.query('SELECT * FROM tickets', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Ticket.updateStatus = (id, status, result) => {
    sql.query(
        'UPDATE tickets SET status = ? WHERE id = ?',
        [status, id],
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: 'not_found' }, null);
                return;
            }
            result(null, { id: id, status: status });
        }
    );
};

Ticket.remove = (id, result) => {
    sql.query('DELETE FROM tickets WHERE id = ?', id, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: 'not_found' }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = Ticket;
