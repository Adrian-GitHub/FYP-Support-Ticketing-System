// This is the file, where all requests are coming in
// The request then sends the data to the function referenced in the API/FOLDER file 
// Once that completes all action is reported back here
// This file is specific to the ONLY client related functions


// Client functions
const client = require("./client/client");

const express = require("express");
const router = express.Router();

router.post("/Register", client.register);
router.post("/ChangePassword", client.changePassword);
router.post("/DeleteAccount", client.deleteAccount);
// Get ALL data about the account that's logged in
router.post("/GetUserData", client.getUserData);

module.exports = router;