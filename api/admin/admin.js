const express = require("express");
const router = express.Router();
// Load Admin model for MongoDB(used by Mongoose)
const Admin = require('../../database/models/Admin/Admin_Account');
// Ticket Model
const Ticket = require('../../database/models/Ticket/Ticket_Process');
// MongoDB
var MongoClient = require('../../database/config/DatabaseConnection');
var connection = MongoClient.getDb();
// Hashing
const crypto = require('crypto');

// Register route
router.post("/Register", (req, res) => { // Form validation
        connection.collection('users').findOne({ username: req.body.username }).then(user => {
            if (user) {
                return res.json({ username: "Username_taken" });
            } else { // Hash password before saving in database
                // Generate random salt
                let salt = crypto.randomBytes(128).toString('base64');
                // Hash the password using the generated salt
                let hashedPassword = hashPassword(req.body.password, salt);
                // Create new user
                const newUser = new Admin({ name: req.body.name, username: req.body.username, password: hashedPassword, salt: salt });
                // We have the data, user with hashed password. Now send data to mongoDB
                // Put all data at main/users collection
                connection.collection("users").insertOne(newUser, function (err, res) {
                    // If something went wrong, throw the error
                    if (err)
                        throw err;
                    // Else console.log that the user was added
                    console.log("User<ADMIN>: " + req.body.name + " was added to the database. ");
                });
                return res.json({ username: "Username is free" });
            };
        });
});
function hashPassword(password, salt){
     return hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512', (err, key) => {
                    if (err)
                        throw err;
                }).toString('hex')
}
// New Ticket Creation
router.post("/NewTicket", (req, res) => { // Create new ticket with all data being customised
    // Data was sent from the admin dashboard
    // Create new ticket based on the data given to us
    const newTicket = new Ticket({ title: req.body.title, desc: req.body.description, createdBy: req.body.createdBy , currentSupportStaff: req.body.currentStaff, stage: req.body.ticketState ? req.body.ticketState : 0});
    // Open DB and then insert new ticket using Ticket Model defined
    connection.collection("tickets").insertOne(newTicket, function (err, res) {
        // If something went wrong, throw the error
        if (err)
            throw err;
        // Else console log for reference that new ticket was created by admin
        console.log("New Ticket was created by Admin");
        // Return status
    });
    return res.json({status: "ticket_created"})
});

// Get all tickets from DB
router.post("/GetTickets", (req, res) => {
    var cursor = connection.collection('tickets').find();
    // Construct that Data into the object
    const ticketData = [];
    // Execute the each command, triggers for each document
    cursor.forEach(function(doc) {
         // If the item is null then the cursor is empty
         if(doc == null) {
            //quit
            return;
        }
          // otherwise, do something with the item
          ticketData.push(doc);
      }, function(err) {
        // done by error, when error occurs that means all data was read
        // Send constructed JSON from MongoDB data via RES to the frontend
        res.json({files: ticketData})
      });
});

// Get full list of staff members from DB
router.post("/GetStaffList", (req, res) => {
    // Create a link to DB for the users tab
    var cursor = connection.collection('users').find();
    // Variable to store data
    const staffData = [];
    // Execute the each command, triggers for each document
    cursor.forEach(function(doc) {
         // If the item is null then the cursor is empty
         if(doc == null) {
            //quit
            return;
        }
        // Safety check, if data doesn't have STAFF as its title then skip
        if(doc.isWho !== "support"){
            // skip current iteration
            return; 
        }
          // otherwise, do something with the item
          // but before, delete the data that isn't needed
          delete doc.password;
          delete doc.salt;
          delete doc.registrationDate;
          // Now insert
          staffData.push(doc);
      }, function(err) {
        // done by error, when error occurs that means all data was read
        // Send constructed JSON from MongoDB data via RES to the frontend
        res.json({staffData: staffData})
      });
});
module.exports = router;

