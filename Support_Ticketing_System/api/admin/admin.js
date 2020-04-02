const express = require("express");
const router = express.Router();
// Load User model for MongoDB(used by Mongoose)
const User = require('../../database/models/User_Account');
// Ticket Model
const Ticket = require('../../database/models/Ticket_Process');
// Ticket History Model
const TicketHistory = require('../../database/models/Ticket_History');
// MongoDB
var MongoClient = require('../../database/config/DatabaseConnection');
var connection = MongoClient.getDb();
const ObjectId = require('mongodb').ObjectId;
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
                const newUser = new User({ name: req.body.name, username: req.body.username, password: hashedPassword, salt: salt, isWho: 'admin' });
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
    // Cookie user id created when logged in
    const user_id = req.cookies['user_id'];
    // Data was sent from the admin dashboard
    // Create new ticket based on the data given to us
    const newTicket = new Ticket({ title: req.body.title, desc: req.body.description, createdBy: req.body.createdBy, createdById: user_id , currentSupportStaff: req.body.currentStaff ? req.body.currentStaff : 'free', status: req.body.ticketState ? req.body.ticketState : 1});
    // Open DB and then insert new ticket using Ticket Model defined
    connection.collection("tickets").insertOne(newTicket, function (err, res) {
        // If something went wrong, throw the error
        if (err)
            throw err;
        // Else console log for reference that new ticket was created by admin
        console.log("New Ticket was created by Admin");
        // Return status
    });
    const newTicketHistory = new TicketHistory({ticketID: ticketID, staffId: user_id, action: 'Ticket Created', desc: "Ticket created by Admin", staffName: 'ADMIN'});
    onnection.collection("ticketHistory").updateOne({ticketID: ObjectId(ticketID)},{"$push":{record: {newTicketHistory}}});
    console.log("<PROCESS_MODIFIED>New Ticket was created by Admin");
    return res.json({status: "ticket_created"})
});

// Get all tickets from DB
router.post("/GetStats", (req, res) => {
    /*
        VERIFY IF ADMIN BEFORE PROCEEDING
    */
    const isAdmin = req.cookies['privilaged_user'];
    if(isAdmin !== 'admin'){
        res.json({files: 'error'});
        return;
    }       
    else if (isAdmin === 'admin'){
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
        }, function(err) {/* just catch the error, no need to do anything with is as we continue with the work */ });
        const newCursor = connection.collection('users').find();
        // Counters
        let userCount = 0, staffCount = 0;
        // Execute the each command, triggers for each document
        newCursor.forEach(function(doc) {
            // If the item is null then the cursor is empty
            if(doc == null) {
                //quit
                return;
            }
            // We're not interested in admin data
            if(doc.isWho === "admin"){
                // skip current iteration
                return; 
            }
            else if(doc.isWho === "support"){
                staffCount++;
            }
            else if(doc.isWho === "client"){
                userCount++;
            }
        }, function(err) {
            // done by error, when error occurs that means all data was read
            // Send constructed JSON from MongoDB data via RES to the frontend
            res.json({files: ticketData , userCount: userCount, staffCount: staffCount})
        });
    }  
});
router.post('/StaffDetails', (req,res) => {
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
        // Safety check, if data is client (client can delete it for themselves)
        if(doc.isWho === 'client'){
            // skip current iteration
            return; 
        }
        // otherwise, do something with the item
        // but before, delete the data that isn't needed
        delete doc.password;
        delete doc.salt;
        // Now insert
        staffData.push(doc);
    }, function(err) {
        // done by error, when error occurs that means all data was read
        // Send constructed JSON from MongoDB data via RES to the frontend
        res.json({staffData: staffData})
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
// Assigns staff to the ticket
router.post('/AssignStaff', (req,res) => {
    // We are receiving ID and NAME of staff and Ticket ID
    // Assign it to the ticket
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"currentSupportStaff": req.body.name, "staffId": req.body.id}}, (err, res) => {
        if(err) throw err;
    });
    // Now create a history of the ticket
    const username = req.cookies['username'];
    // Define it first
    const newTicketHistory = new TicketHistory({ticketID: req.body.ticketID, staffId: req.body.id, action: 'Staff_Assign', desc: 'Admin action', staffName: username});
    connection.collection("ticketHistory").insertOne(newTicketHistory, function (err, res) {
        // If something went wrong, throw the error
        if (err)
            throw err;
        // Else console log for reference that staff was assigned to a ticket by admin
        console.log("Staff assigned by admin to ticket " + req.body.ticketID);
    });
    // Return status
    res.json({status: 'success'});
});
// Chaning the status of a ticket
router.post('/ChangeStatus', (req, res) => {
    // Firstly, we update the ticket
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": Number(req.body.ticketStatus)}}, (err, res) => {
        if(err) throw err;
    });
    // Now, create a record of this action
    // Get user ID that was set during the login session
    const userID = req.cookies['user_id'];
    const username = req.cookies['username'];
    //Build the object
    const newTicketHistory = new TicketHistory({ticketID: req.body.ticketID, staffId: userID, action: 'Update_Ticket_Status', desc: req.body.desc, staffName: username});
    //Insert
    connection.collection("ticketHistory").insertOne(newTicketHistory, function (err, res) {
        // If something went wrong, throw the error
        if (err)
            throw err;
        // Else console log for reference that staff was assigned to a ticket by admin
        console.log("Ticket status changed by admin to ticket " + req.body.ticketID);
    });
    res.json({status: 'success'});
});
router.post('/DeleteTicket', (req, res) => {
    // Firstly, we update the ticket
    connection.collection("tickets").findOneAndDelete({"_id": ObjectId(req.body.ticketID)}, (err, res) => {
        if(err) throw err;
    });
    res.json({status: 'success'});
});
router.post('/DeleteUser', (req, res) => {
    connection.collection("users").findOneAndDelete({"_id": ObjectId(req.body.userID)}, (err, res) => {
        if(err) throw err;
    });
    res.json({status: 'success'});
});
router.post('/AskForMoreInformation', (req, res) => {
    // Update the ticket, with status 10. Status 10 means ASK FOR MORE INFORMATION
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 10}}, (err, res) => {
        if(err) throw err;
    });
    // Get variables
    const userID = req.cookies['user_id'];
    const username = req.cookies['username'];
    //Build the object
    const newTicketHistory = new TicketHistory({ticketID: req.body.ticketID, staffId: userID, action: 'Ask_for_more_information', desc: "More information is needed!", staffName: username});
    //Insert
    connection.collection("ticketHistory").insertOne(newTicketHistory, function (err, res) {
        // If something went wrong, throw the error
        if (err)
            throw err;
        // Else console log for reference that staff was assigned to a ticket by admin
        console.log("Ticket status changed by admin to ticket " + req.body.ticketID);
    });
    res.json({status: 'success'});
});
module.exports = router;

