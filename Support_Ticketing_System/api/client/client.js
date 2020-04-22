const express = require("express");
const router = express.Router();
// Fetch statement
const fetch = require('node-fetch');
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
const register = (req, res) => { // Form validation
        connection.collection('users').findOne({ username: req.body.username }).then(user => {
            if (user) {
                return res.json({ username: "Username_taken" });
            } else { // Hash password before saving in database
                // Generate random salt
                let salt = crypto.randomBytes(128).toString('base64');
                // Hash the password using the generated salt
                let hashedPassword = User.hashPassword(req.body.password, salt);;
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
};

// Create new ticket
const createTicket = async(req, res) => {
    // Ticket ID will be populated later
    let ticketID;
    const newTicket = new Ticket({camundaID: req.body.camundaID, title: req.body.ticketTitle, desc: req.body.ticketDesc, createdBy: req.body.username, createdById: req.body.user_id , currentSupportStaff: 'free', status: 1});
    // Open DB and then insert new ticket using Ticket Model defined
    connection.collection("tickets").insertOne(newTicket, function (err, res) {
        // If something went wrong, throw the error
        if (err)
            throw err;
        // Else console log for reference that new ticket was created by client
        console.log("<CREATION>New Ticket was created by Client " + req.body.username);
        // Assign the value of inserted ID to our variable
        ticketID = res.insertedId;
        const newTicketHistory = new TicketHistory({ticketID: ticketID, records: {staffId: req.body.user_id, action: 'Ticket Created by the CLIENT', desc: "Created by "+ req.body.name +" (CLIENT'S NAME)", staffName: "CLIENT", date: new Date().toISOString()}});
        connection.collection("ticketHistory").insertOne(newTicketHistory);
        console.log("<PROCESS_MODIFIED>New Ticket was created by Client");
    });   
    return res.json({status: "success"})
};
// Get All Tickets belonging to this user
const getTickets = (req, res) => {
    const username = req.cookies['username'];
    if(!username)// if username is not defined
    {
        //User is not authed properly then
        res.json({status: 'not_authed'});
        return;
    }
    var cursor = connection.collection('tickets').find({ createdBy: { $in: [ username ] } });
    // Construct that Data into the object
    const ticketData = [];
    // cursor contains the callee information too, we don't need it, when doing a forEach loop that information is automatically removed
    cursor.forEach(function(ticket) {
          // The ticket is already sorted before we entered this loop, so we know it's correct
          ticketData.push(ticket);
      }, function(err) {
          //done by error(when there's no more tickets to go through the error will occur)
          res.json({status: 'success', tickets: ticketData})
      });
};
const getUserData = (req, res) => {
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
};
const changePassword = (req, res) => {
    const username = req.cookies['username'];
    let salt, hashedPassword;
    try{
        salt = crypto.randomBytes(128).toString('base64');
        hashedPassword = User.hashPassword(req.body.password.toString(), salt);
    } catch{}
    connection.collection("users").findOneAndUpdate({"username": username} ,{"$set": {"password": hashedPassword, "salt": salt}}, (err, res) => {
        if(err) throw err;
    });
    res.json({status: 'success'});
};
const deleteAccount = (req, res) => {
    const username = req.cookies['username'];
    connection.collection("users").deleteOne({"username": username}, (err, results) => {
        if (err) throw err;
    });
    //Clear the cookies, the user is not authed any more as password was changed
    res.clearCookie("authenticated_user");
    res.clearCookie("username");
    res.clearCookie("user_id");
    res.json({status: "success"})
};
const closeTicket = async(req, res) => {
    const id = req.body.id;
    console.log(id)
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(id)} ,{"$set": {"status": 14 }}, (err, res) => {
        if(err) throw err;
    });
    console.log('<PROCESS_MODIFIED>Ticket was closed by Client');
    // Now, repeat this inside Camunda's engine
    let Camunda_ID;
    const requestBody =  {
        "variables": {
          "cancel": {"value":"true","type":"String"} // Yes, client cancels the ticket
        }
    };
    // Before we begin, we will need to fetch new ID and then use this ID to complete the task
    await fetch(`http://localhost:8080/engine-rest/task?processInstanceId=${req.body.camundaID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => Camunda_ID = json[0].id).catch((err) => console.log(err));
    await fetch(`http://localhost:8080/engine-rest/task/${Camunda_ID}/complete`, {
        method: 'POST',
        body: JSON.stringify(requestBody),  //client
        headers: { 'Content-Type': 'application/json' },
    })
    .catch((err) => console.log(err));

    // End of CAMUNDA REST API COMMUNICATION

    res.json({status: 'success'});
};
const submitMoreInformation = async(req, res) => {
    // Ticket ID and Message are passed into here
    const ticketID = req.body.id;
    const message = req.body.message;
    if(ticketID){
      // Update the ticket so that the support knows that the user has submitted more information 
      connection.collection("ticketHistory").updateOne({"ticketID": ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: 'CLIENT', action: 'MORE INFORMATION ADDED', desc: message , staffName: 'CLIENT'}}});
      // Update ticket status so that the system recognises this ticket again. As when support requests more information, the ticket is in a `suspended` state meaning that none can interact with it except the client
      connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(ticketID)} ,{"$set": {"status": Number(5)}});
      // Before finishing this, let Camunda know about this
        // The payload
        const requestBody =  {
            "variables": {
            "informationSubmitted": {"value":"true","type":"String"}
            }
        };
        // Before we begin, we will need to fetch new ID and then use this ID to complete the task
        let Camunda_ID;
        await fetch(`http://localhost:8080/engine-rest/task?processInstanceId=${req.body.camundaID}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(json => Camunda_ID = json[0].id).catch((err) => console.log(err));
        await fetch(`http://localhost:8080/engine-rest/task/${Camunda_ID}/complete`, {
            method: 'POST',
            body: JSON.stringify(requestBody),  //client
            headers: { 'Content-Type': 'application/json' },
        })
        .catch((err) => console.log(err));

    // End of CAMUNDA REST API COMMUNICATION
      res.json({status: 'success'});
    }
};
const followUp = async(req, res) => {
    // This function is only available when the ticket is closed and it is still located in the CLOSED STATE(still accessible to the system)
    // This information is checked before this function is initiated
    // 0. Get the required variables
    const ticketID = req.body.id;
    const message = req.body.message;
    console.log('<PROCESS_MODIFIED>Client has submitted extra information' + message + 'to ticket with ID ' + ticketID);
      // 1. Update the ticket's status to that it is opened again
      connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(ticketID)} ,{"$set": {"status": Number(3), "staffId": "free", "desc": message}});
      // 2. Update the ticket's details. This is a follow-up request
      connection.collection("ticketHistory").updateOne({"ticketID": ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: 'CLIENT', action: 'FOLLOW UP REQUEST', desc: message , staffName: 'CLIENT'}}});
      // 3. Notify Camunda of this change
      let Camunda_ID;
        // Getting the new task ID (if task is modified in any way then new ID is generated by Camunda)
        await fetch(`http://localhost:8080/engine-rest/task?processInstanceId=${req.body.camundaID}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json()).then(json => Camunda_ID = json[0].id).catch((err) => console.log(err));
        const requestBody =  {
            "variables": {
                    "followUp": {"value":"true","type":"String"}, // Follow-UP the ticket
                    "solveByClose": {"value":"false","type":"String"},
                    "solveByExp": {"value":"false","type":"String"},
                    "ticketID": {"value": `${ticketID}`,"type":"String"} // Ticket ID used by Camunda
            }
        };
        await fetch(`http://localhost:8080/engine-rest/task/${Camunda_ID}/complete`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
        })
        .catch((err) => console.log(err));
         
      // 4. Report back
      res.json({status: 'success'});
}

module.exports = router;
module.exports.register = register;
module.exports.createTicket = createTicket;
module.exports.getTickets = getTickets;
module.exports.getUserData = getUserData;
module.exports.changePassword = changePassword;
module.exports.deleteAccount = deleteAccount;
module.exports.closeTicket = closeTicket;
module.exports.followUp = followUp;
module.exports.submitMoreInformation = submitMoreInformation;

