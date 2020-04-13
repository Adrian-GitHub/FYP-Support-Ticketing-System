// This is the file, where all requests are coming in
// All incoming connections to this file are managed by Camunda, which then in return initiates the correct functions

const express = require("express");
const router = express.Router();

const camunda = require('./camunda/requests');

// Create new ticket
router.post("/CreateTicketOnBehalf", camunda.createTicketOnBehalf);
router.post("/CreateTicket", camunda.createTicket);
router.post("/CloseTicket", camunda.closeTicket);
router.post("/CloseAbandonedTicket", camunda.closeAbandonedTicket);
router.post("/CloseExpiredTicket", camunda.closeExpiredTicket);
module.exports = router;