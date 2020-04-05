// This is the file, where all requests are coming in
// The request then sends the data to the function referenced in the API/FOLDER file 
// Once that completes all action is reported back here
// This file is specific to the ONLY client related functions


// Client functions
const client = require("./client/client");

const express = require("express");
const router = express.Router();

// Account related functions
router.post("/Register", (req, res) => {
    client.register(req, res);
});
router.post("/ChangePassword", (req, res) => {
    client.changePassword(req, res);
});
router.post("/DeleteAccount", (req, res) => {
    client.deleteAccount(req, res);
});
// Get ALL data about the account that's logged in
router.post("/GetUserData", (req, res) => {
    client.getUserData(req, res);
});

// Ticket related functions

// Create new ticket
router.post("/CreateTicket", (req, res) => {
    client.createTicket(req, res);
});
// Get All Tickets belonging to this user
router.post("/GetTickets", (req, res) => {
    client.getTickets(req,res);
});
// Close the selected ticket
router.post("/CloseTicket", (req, res) => {
    client.closeTicket(req, res);
});
// Submits more information regarding "more information" topic as asked by staff member
router.post("/SubmitMoreInformation", (req, res) => {
    client.submitMoreInformation(req, res);
});

module.exports = router;