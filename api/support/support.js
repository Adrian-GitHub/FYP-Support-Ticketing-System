const express = require("express");
const router = express.Router();
// Load models for MongoDB(used by Mongoose)
const User = require("../../database/models/User_Account");
const TicketHistory = require("../../database/models/Ticket_History");
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
                const newUser = new User({ name: req.body.name, username: req.body.username, password: hashedPassword, salt: salt, isWho: 'support' });
                // We have the data, user with hashed password. Now send data to mongoDB
                // Put all data at main/users collection
                connection.collection("users").insertOne(newUser, function (err, res) {
                    // If something went wrong, throw the error
                    if (err)
                        throw err;
                    // Else console.log that the user was added
                    console.log("User<Support_Staff>: " + req.body.name + " was added to the database. ");
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
};
router.post("/GetMyTickets", (req, res) => {
    const username = req.cookies['username'];
    const user_id = req.cookies['user_id'];
    if(!username)// if username is not defined
    {
        //User is not authed properly then
        res.json({status: 'not_authed'});
    }
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
        // If ticket doesn't bear support's staff ID then skip
        const id = doc.staffId;
        if(id === user_id) {ticketData.push(doc)}
          // otherwise, do something with the item
          // push it to our array
        else return;
      }, function(err) {
          //done by error
          res.json({status: 'success', tickets: ticketData})
      });
});
router.post("/GetAvailableTickets", (req, res) => {
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
        // 'free' means that ticket can be claimed
        if(doc.staffId !== 'free') {return;}
          // otherwise, do something with the item
          // push it to our array
          ticketData.push(doc);
      }, function(err) {
          //done by error
          res.json({status: 'success', tickets: ticketData})
      });
});
router.post("/ClaimTicket", (req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"currentSupportStaff": name, "staffId": user_id}}, (err, res) => {
        if(err) throw err;
    });
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {staffId: user_id, action: 'Ticket Claimed', desc: "Ticket was claimed by ", staffName: name, date: new Date().toISOString()}}});
    console.log("<PROCESS_MODIFIED>Support Staff claimed a ticket for themselves.");
    res.json({status: 'success'});
});
router.post("/AskForMoreInformation", (req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 10}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: user_id, action: 'Asked for more information', desc: "Staff requires more information from you ", staffName: name}}});
    console.log("<PROCESS_MODIFIED>Support Staff member asked for more information about ticket.");
    res.json({status: 'success'});
});
router.post("/SuspendTicket", (req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 9}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: user_id, action: 'Suspend Ticket', desc: "Ticket Suspended by Staff member ", staffName: name}}});

    console.log("<PROCESS_MODIFIED>Support Staff member suspended a ticket.");
    res.json({status: 'success'});
});
router.post("/CloseTicket", (req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 11}}, (err, res) => {
        if(err) throw err;
    });
      //History
      connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {staffId: user_id, action: 'Ticket Closed', desc: "Ticket Closed by Staff member ", staffName: name}}});

      console.log("<PROCESS_MODIFIED>Support Staff member closed a ticket.");
    res.json({status: 'success'});
});
router.post("/CloseExpiredTicket", (req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 12}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: user_id, action: 'Ticket Expired - Closed', desc: "Expired ticket closed by Staff member ", staffName: name}}});

    console.log("<PROCESS_MODIFIED>Support Staff memberclosed expired ticket.");
    res.json({status: 'success'});
});
router.post("/CloseAbandonedTicket", (req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 15}}, (err, res) => {
        if(err) throw err;
    });

    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: user_id, action: 'Abandoned Ticket - Close', desc: "Abanoned Ticket was closed by Staff member ", staffName: name}}});

    console.log("<PROCESS_MODIFIED>Support Staff member closed abandoned ticket.");

    res.json({status: 'success'});
});
router.post("/SolveTicket", (req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    
    
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 7}}, (err, res) => {
        if(err) throw err;
    });

    //Creating history, creating object on the fly without schema as it DOES differ from every other previous request
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: user_id, action: 'Ticket Solved', desc: "Ticket Solved by Staff member", staffName: name}}});

    console.log("<PROCESS_MODIFIED>Staff just solved a ticket");
    res.json({status: 'success'});
});
router.post("/ReallocateTicket", (req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 6, "currentSupportStaff": 'free', "staffId": 'free'}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {staffId: user_id, action: 'Ticket Reallocated', desc: "Ticket Rellocated by Staff member ", staffName: name, date: new Date().toISOString()}}});
    console.log("<PROCESS_MODIFIED>Support Staff member just reallocated a ticket.");
    res.json({status: 'success'});
});
router.post("/OpenTicketOnBehalf", (req, res) => {
        // Ticket ID will be populated later
        let ticketID_db;
        const username = req.cookies['username'];
        const name = req.cookies['name'];
        const user_id = req.cookies['user_id'];
        const newTicket = new Ticket({ title: req.body.ticketTitle, ticketDesc: req.body.description, createdBy: req.body.onBehalf, createdById: user_id , currentSupportStaff: username, staffId: user_id, status: 2});
        connection.collection("tickets").insertOne(newTicket, function (err, res) {
            if (err)
                throw err;
            // Assign the value of inserted ID to our variable
            ticketID_db = res.insertedId;
            console.log("<CREATION>New Ticket was created by Support on Behalf of " + req.body.onBehalf);
            // Start after this
            const newTicketHistory = new TicketHistory({ticketID: ticketID_db, records: {staffId: user_id, action: 'Ticket Created on Behalf', desc: "Ticket Created on Behalf of "+ req.body.onBehalf +" by Staff member", staffName: name, date: new Date().toISOString()}});
            connection.collection("ticketHistory").insertOne(newTicketHistory);
            console.log("<PROCESS_MODIFIED>New Ticket was created by Support on Behalf of " + req.body.onBehalf);
        });   
        res.json({status: "ticket_created"})
});
router.post("/GetTicketHistory", (req, res) => {
   // Get ticket history for the particular ticket
   connection.collection("ticketHistory").findOne({ticketID: req.body.ticketID}, function(err, result) {
    if (err) throw err;
    res.json({history: result});
  });
});
module.exports = router;

