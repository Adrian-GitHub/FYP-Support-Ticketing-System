// This is the file, where all requests are coming in
// The request then sends the data to the function referenced in the API/FOLDER file 
// Once that completes all action is reported back here
// This file is specific to the ONLY admin related functions

// Admin functions
const admin = require("./admin/admin");

const express = require("express");
const router = express.Router();

// Register functions
router.post("/Register", admin.register);

// Ticket functions
router.post("/NewTicket", admin.newTicket);
// Chaning the status of a ticket
router.post('/ChangeStatus', admin.changeStatus);
// Deletes the ticket
router.post('/DeleteTicket', admin.deleteTicket);
// Ticket related task
router.post('/AskForMoreInformation', admin.askForMoreInformation);

// User specific functions

// Get statistics, amount of tickets, users etc.,
router.post("/GetStats", admin.getStats);
// Staff specific statistics
router.post('/StaffDetails', admin.staffDetails);
// Get full list of staff members from DB
router.post("/GetStaffList", admin.staffList);
// Assigns staff to the ticket
router.post('/AssignStaff', admin.assignStaff);
// Removes the staff member from the database or client.
router.post('/DeleteUser', admin.deleteUser);

module.exports = router;