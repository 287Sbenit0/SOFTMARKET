const Ticket = require('../models/ticketModel');

exports.createTicket = (req, res) => {
    const newTicket = new Ticket({
        email: req.body.email,
        message: req.body.message
    });

    Ticket.create(newTicket, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || 'Error occurred while creating the ticket.'
            });
        } else {
            res.send(data);
        }
    });
};

exports.getAllTickets = (req, res) => {
    Ticket.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || 'Error occurred while retrieving tickets.'
            });
        } else {
            res.send(data);
        }
    });
};

exports.updateTicketStatus = (req, res) => {
    const { status } = req.body;
    Ticket.updateStatus(req.params.id, status, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({
                    message: `Ticket not found with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Error updating ticket with id ${req.params.id}`
                });
            }
        } else {
            res.send(data);
        }
    });
};

exports.deleteTicket = (req, res) => {
    Ticket.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({
                    message: `Ticket not found with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Could not delete ticket with id ${req.params.id}`
                });
            }
        } else {
            res.send({ message: 'Ticket was deleted successfully!' });
        }
    });
};
