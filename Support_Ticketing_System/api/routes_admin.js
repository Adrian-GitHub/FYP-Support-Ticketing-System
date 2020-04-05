// This is the file, where all requests are coming in
// The request then sends the data to the function referenced in the API/FOLDER file 
// Once that completes all action is reported back here
// This file is specific to the ONLY admin related functions

// Admin functions
const admin = require("./admin/admin");

const express = require("express");
const router = express.Router();

// Register functions
router.post("/Register", (req, res) => {
    admin.register(req, res);
});

// Ticket functions
router.post("/NewTicket", (req, res) => { 
    admin.newTicket(req, res);
});
// Chaning the status of a ticket
router.post('/ChangeStatus', (req, res) => {
    admin.changeStatus(req, res);
});
// Deletes the ticket
router.post('/DeleteTicket', (req, res) => {
    admin.deleteTicket(req, res);
});
// Ticket related task
router.post('/AskForMoreInformation', (req, res) => {
    admin.askForMoreInformation(req,res);
});

// User specific functions

// Get statistics, amount of tickets, users etc.,
router.post("/GetStats", (req, res) => {
    admin.getStats(req, res);
});
// Staff specific statistics
router.post('/StaffDetails', (req,res) => {
    admin.staffDetails(req, res);
});
// Get full list of staff members from DB
router.post("/GetStaffList", (req, res) => {
    admin.staffList(req, res);
});
// Assigns staff to the ticket
router.post('/AssignStaff', (req,res) => {
    admin.assignStaff(req, res);
});
// Removes the staff member from the database or client.
router.post('/DeleteUser', (req, res) => {
    admin.deleteUser(req, res);
});

module.exports = router;