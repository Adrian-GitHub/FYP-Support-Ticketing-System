// This is the file, where all requests are coming in
// The request then sends the data to the function referenced in the API/FOLDER file 
// Once that completes all action is reported back here
// This file is specific to the ONLY support related functions

// Support functions
const support = require("./support/support");

const express = require("express");
const router = express.Router();

// Account related

router.post("/Register", support.Register);
router.post("/GetMyTickets", support.GetMyTickets);
router.post("/GetAvailableTickets", support.GetAvailableTickets);

// Ticket related functions

router.post("/ClaimTicket", support.ClaimTicket);
router.post("/AskForMoreInformation", support.AskForMoreInformation);
router.post("/SuspendTicket", support.SuspendTicket);
router.post("/CloseTicket", support.CloseTicket);
router.post("/CloseExpiredTicket", support.CloseExpiredTicket);
router.post("/CloseAbandonedTicket", support.CloseAbandonedTicket);
router.post("/SolveTicket", support.SolveTicket);
router.post("/ReallocateTicket", support.ReallocateTicket);
router.post("/OpenTicketOnBehalf", support.OpenTicketOnBehalf);
router.post("/GetTicketHistory", support.GetTicketHistory);

module.exports = router;