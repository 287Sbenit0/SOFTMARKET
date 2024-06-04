const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getAllTickets);
router.put('/:id', ticketController.updateTicketStatus);
router.delete('/:id', ticketController.deleteTicket); // Nueva ruta para eliminar un ticket

module.exports = router;
