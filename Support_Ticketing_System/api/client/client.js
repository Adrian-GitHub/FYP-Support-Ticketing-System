const express = require("express");
const router = express.Router();
// Load User's model for MongoDB(used by Mongoose)
const User = require("../../database/models/User_Account");
// For ticket creation
const Ticket = require("../../database/models/Ticket_Process");
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
                const newUser = new User({ name: req.body.name, username: req.body.username, password: hashedPassword, salt: salt, isWho: 'client' });
                // We have the data, user with hashed password. Now send data to mongoDB
                // Put all data at main/users collection
                connection.collection("users").insertOne(newUser, function (err, res) {
                    // If something went wrong, throw the error
                    if (err)
                        throw err;
                    // Else console.log that the user was added
                    console.log("User<CLIENT>: " + req.body.name + " was added to the database. ");
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

// Create new ticket
router.post("/CreateTicket", (req, res) => {
    // Ticket ID will be populated later
    let ticketID;
    const username = req.cookies['username'];
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    const newTicket = new Ticket({ title: req.body.ticketTitle, desc: req.body.ticketDesc, createdBy: username, createdById: user_id , currentSupportStaff: 'free', status: 1});
    // Open DB and then insert new ticket using Ticket Model defined
    connection.collection("tickets").insertOne(newTicket, function (err, res) {
        // If something went wrong, throw the error
        if (err)
            throw err;
        // Else console log for reference that new ticket was created by client
        console.log("New Ticket was created by Client " + username);
        // Assign the value of inserted ID to our variable
        ticketID = res.insertedId;
        const newTicketHistory = new TicketHistory({ticketID: ticketID, records: {staffId: user_id, action: 'Ticket Created by the CLIENT', desc: "Created by "+ username +" (CLIENT)", staffName: "CLIENT", date: new Date().toISOString()}});
        connection.collection("ticketHistory").insertOne(newTicketHistory);
        console.log("<PROCESS_MODIFIED>New Ticket was created by Client");
    });   
    return res.json({status: "success"})
});
// Get All Tickets belonging to this user
router.post("/GetTickets", (req, res) => {
    const username = req.cookies['username'];
    const user_id = req.cookies['user_id'];
    if(!username)// if username is not defined
    {
        //User is not authed properly then
        res.json({status: 'not_authed'});
        return;
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
        // If ticket doesn't bear user's id then skip
        if(doc.createdById !== user_id) {return;}
          // otherwise, do something with the item
          // push it to our array
          ticketData.push(doc);
      }, function(err) {
          //done by error
          res.json({status: 'success', tickets: ticketData})
      });
});
router.post("/GetUserData", (req, res) => {
    //Variable that will be returned via json response
    const userData = [];
    //Getting user, that was authed during login
    const username = req.cookies['username'];
    //If username doesn't exist that means that user wasn't logged in. 
    if(!username) {res.json({status: 'error'});}
    // Get ticket count
    const newCursor = connection.collection('tickets').find();
    let ticketCount = 0;
    // Execute the each command, triggers for each document
    newCursor.forEach(function(doc) {
         // If the item is null then the cursor is empty
         if(doc == null) {
            //quit
            return;
        }
        // Only current user's tickets
        if(doc.createdBy === username){
            // add it to the count
            ticketCount++;
            return; 
        }
    });
    // Else , proceeding fetching data from DB. We will skip password, salt as there's no need for it
   connection.collection('users').findOne({'username': username}, {projection: {password: 0, salt: 0, _id: 0}}).then(function(doc){
        userData.push(doc);
        //Send it back to the user
        res.json({userData: userData, ticketData: ticketCount });
    });
});
router.post("/ChangePassword", (req, res) => {
    const username = req.cookies['username'];
    let salt, hashedPassword;
    try{
        salt = crypto.randomBytes(128).toString('base64');
        hashedPassword = hashPassword(req.body.password.toString(), salt);
    } catch{}
    connection.collection("users").findOneAndUpdate({"username": username} ,{"$set": {"password": hashedPassword, "salt": salt}}, (err, res) => {
        if(err) throw err;
    });
    res.json({status: 'success'});
});
router.post("/DeleteAccount", (req, res) => {
    const username = req.cookies['username'];
    connection.collection("users").deleteOne({"username": username}, (err, results) => {
        if (err) throw err;
    });
    //Clear the cookies, the user is not authed any more as password was changed
    res.clearCookie("authenticated_user");
    res.clearCookie("username");
    res.clearCookie("user_id");
    res.json({status: "success"})
});
router.post("/CloseTicket", (req, res) => {
    const id = req.body.id;
    console.log(id)
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(id)} ,{"$set": {"status": 14 }}, (err, res) => {
        if(err) throw err;
    });
    res.json({status: 'success'});
});
router.post("/SubmitMoreInformation", (req, res) => {
    // Ticket ID and Message are passed into here
    const ticketID = req.body.id;
    const message = req.body.message;
    if(ticketID){
      connection.collection("ticketHistory").updateOne({"ticketID": ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: 'CLIENT', action: 'MORE INFORMATION ADDED', desc: message , staffName: 'CLIENT'}}});
      res.json({status: 'success'});
    }
});

module.exports = router;

