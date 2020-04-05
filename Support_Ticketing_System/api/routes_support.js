// This is the file, where all requests are coming in
// The request then sends the data to the function referenced in the API/FOLDER file 
// Once that completes all action is reported back here
// This file is specific to the ONLY support related functions

// Support functions
const support = require("./support/support");

const express = require("express");
const router = express.Router();

// Account related

router.post("/Register", (req, res) => {
    support.Register(req, res);
});

router.post("/GetMyTickets", (req, res) => {
    support.GetMyTickets(req, res);
});

router.post("/GetAvailableTickets", (req, res) => {
    support.GetAvailableTickets(req,res);
});

// Ticket related functions

router.post("/ClaimTicket", (req, res) => {
    support.ClaimTicket(req, res);
});
router.post("/AskForMoreInformation", (req, res) => {
    support.AskForMoreInformation(req, res);
});
router.post("/SuspendTicket", (req, res) => {
    support.SuspendTicket(req, res);
});
router.post("/CloseTicket", (req, res) => {
    support.CloseTicket(req, res);
});
router.post("/CloseExpiredTicket", (req, res) => {
    support.CloseExpiredTicket(req, res);
});
router.post("/CloseAbandonedTicket", (req, res) => {
    support.CloseAbandonedTicket(req, res);
});
router.post("/SolveTicket", (req, res) => {
    support.SolveTicket(req, res);
});
router.post("/ReallocateTicket", (req, res) => {
    support.ReallocateTicket(req, res);
});
router.post("/OpenTicketOnBehalf", (req, res) => {
    support.OpenTicketOnBehalf(req, res);
});
router.post("/GetTicketHistory", (req, res) => {
    support.GetTicketHistory(req, res);
});

module.exports = router;