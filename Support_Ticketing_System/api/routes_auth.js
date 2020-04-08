// This is the file, where all requests are coming in
// The request then sends the data to the function referenced in the API/FOLDER file 
// Once that completes all action is reported back here
// This file is specific to the ONLY authentication related functions

// Auth functions
const auth = require('./shared/login');

const express = require("express");
const router = express.Router();

// Everything is account related in this file

router.post("/Login", auth.Login);
router.post("/Logout", auth.Logout);

module.exports = router;