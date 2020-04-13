// This is the file, where all requests are coming in
// The request then sends the data to the function referenced in the API/FOLDER file 
// Once that completes all action is reported back here
// This file is specific to the ONLY client related functions regarding Ticket instance


// Client functions
const client = require("./client/client");

const express = require("express");
const router = express.Router();

// Create new ticket
router.post("/CreateTicket", client.createTicket);
// Get All Tickets belonging to this user
router.post("/GetTickets", client.getTickets);
// Close the selected ticket
router.post("/CloseTicket", client.closeTicket);
// Submits more information regarding "more information" topic as asked by staff member
router.post("/SubmitMoreInformation", client.submitMoreInformation);
// Follow-up the ticket
router.post("/FollowUpTicket", client.followUp);

module.exports = router;