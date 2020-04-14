const express = require("express");
const router = express.Router();
// Fetch statement
const fetch = require('node-fetch');
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
const Register = (req, res) => { // Form validation
        connection.collection('users').findOne({ username: req.body.username }).then(user => {
            if (user) {
                return res.json({ username: "Username_taken" });
            } else { // Hash password before saving in database
                // Generate random salt
                let salt = crypto.randomBytes(128).toString('base64');
                // Hash the password using the generated salt
                let hashedPassword = User.hashPassword(req.body.password, salt);
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
};
const GetMyTickets = (req, res) => {
    const username = req.cookies['username'];
    const user_id = req.cookies['user_id'];
    const isSupport = req.cookies['privilaged_user'];
    if(!username)// if username is not defined
    {
        //User is not authed properly then
        res.json({status: 'not_authed'});
        return;
    }
    if(isSupport !== 'support' && isSupport !== 'admin'){
        res.json({level: 'nope'});
        return;
    }
    // Find ALL TICKETS where STAFFID is equal to USER_ID and status is NOT EQUAL to 11 or 12 or 13 or 14 or 15 (this statuses indicate expired ticket)
    // Support attendant doesn't need to see this kind of information
    var cursor = connection.collection('tickets').find({ staffId: { $in: [ user_id ] }, status: { $nin: [11, 12, 13, 14, 15] } });
    // Construct that Data into the object
    const ticketData = [];
    // Execute the each command, triggers for each document
    cursor.forEach(function(doc) {
         // If the item is null then the cursor is empty
         if(doc == null) {
            //quit
            return;
        }   
        // push it to our array
        else ticketData.push(doc)
      }, function(err) {
          //done by error
          res.json({status: 'success', tickets: ticketData})
        });
};
const GetAvailableTickets = (req, res) => {
    // Check for all tickets that are saved with status of staffId equivalent to FREE
    var cursor = connection.collection('tickets').find({ staffId: { $in: [ 'free' ] } });
    // Construct that Data into the object
    const ticketData = [];
    // Execute the each command, triggers for each document
    // The reason why we're doing this is that the cursor contains definition of a call which isn't a JSON object itself
    // When we loop it through `forEach` this data is deleted as it ain't a part of it. Although a raw cursor data contains call log by default
    cursor.forEach(function(doc) {
         // If the item is null then the cursor is empty
         if(doc == null) {
            //quit
            return;
        }   
          // push it to our array
          ticketData.push(doc);
      }, function(err) {
          //done by error
          res.json({status: 'success', tickets: ticketData})
      });
};
const ClaimTicket = async(req, res) => {
    let Camunda_ID;
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"currentSupportStaff": name, "staffId": user_id}}, (err, res) => {
        if(err) throw err;
    });
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {staffId: user_id, action: 'Ticket Claimed', desc: "Ticket was claimed by ", staffName: name, date: new Date().toISOString()}}});
    console.log("<PROCESS_MODIFIED>Support Staff claimed a ticket for themselves.");

    // Now, repeat this inside Camunda's engine
    const requestBody =  {
        "variables": {
          "cancel": {"value":"false","type":"String"} // we don't want to cancel the ticket
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
    // Report back
    res.json({status: 'success'});
};
const AskForMoreInformation = async(req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 10}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: user_id, action: 'Asked for more information', desc: "Staff requires more information from you ", staffName: name}}});
    console.log("<PROCESS_MODIFIED>Support Staff member asked for more information about ticket.");


    // Let Camunda know that support staff member asked for more information
    // Construct the payload
         const requestBody =  {
            "variables": {
            "suspendMOREINFO": {"value":"true","type":"String"},
            "suspendByABD": {"value":"false","type":"String"} 
            }
        };
    // Getting the new task ID (if task is modified in any way then new ID is generated by Camunda)
    let Camunda_ID;

    await fetch(`http://localhost:8080/engine-rest/task?processInstanceId=${req.body.camundaID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => Camunda_ID = json[0].id).catch((err) => console.log(err));

    await fetch(`http://localhost:8080/engine-rest/task/${Camunda_ID}/complete`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
    })
    .catch((err) => console.log(err));

    res.json({status: 'success'});
};
const SuspendTicket = async(req, res) => {
    let Camunda_ID;
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 9}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: user_id, action: 'Suspend Ticket', desc: "Ticket Suspended by Staff member ", staffName: name}}});

    console.log("<PROCESS_MODIFIED>Support Staff member suspended a ticket.");

    // REST NOTIFICATION to Camunda
    // Construct the payload
    const requestBody =  {
        "variables": {
        "reAlloc": {"value":"false","type":"String"}, // We are not reallocating the ticket
        "suspend": {"value":"true","type":"String"}, // We are suspending the ticket
        "solve": {"value":"false","type":"String"}, // We are not solving the ticket
        "ticketID": {"value":`${req.body.ticketID}`,"type":"String"} // Ticket ID used by Camunda
        }
    };
    // Let Camunda know that the ticket is now closed
    // Getting the new task ID (if task is modified in any way then new ID is generated by Camunda)
    await fetch(`http://localhost:8080/engine-rest/task?processInstanceId=${req.body.camundaID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => Camunda_ID = json[0].id).catch((err) => console.log(err));

    await fetch(`http://localhost:8080/engine-rest/task/${Camunda_ID}/complete`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
    })
    .catch((err) => console.log(err));

    res.json({status: 'success'});
};
const CloseTicket = async(req, res) => {
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 11}}, (err, res) => {
        if(err) throw err;
    });
      //History
      connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: req.body.user_id, action: 'Ticket Closed', desc: "Ticket Closed by Staff member ", staffName: req.body.name}}});
      if(req.body.reason === 'close') console.log("<PROCESS_MODIFIED>Support Staff member closed a ticket.");
      else if(req.body.reason === 'cancel') console.log("<PROCESS_MODIFIED>Support Staff member cancelled a ticket.");
    res.json({status: 'success'});
};
const CloseExpiredTicket = async(req, res) => {
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 12}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: req.body.user_id, action: 'Ticket Expired - Closed', desc: "Expired ticket closed by Staff member ", staffName: req.body.name}}});
    
    if(req.body.name === 'CAMUNDA') console.log("<PROCESS_MODIFIED>CAMUNDA ENGINE has automatically closed expired ticket.");   
    else console.log("<PROCESS_MODIFIED>Support Staff member closed expired ticket.");   
};
const CloseAbandonedTicket = async(req, res) => {
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 15}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: req.body.user_id, action: 'Abandoned Ticket - Close', desc: "Abanoned Ticket was closed by Staff member ", staffName: req.body.name}}});
    console.log("<PROCESS_MODIFIED>Support Staff member closed abandoned ticket.");
    res.json({status: 'success'});
};
const CloseAbandonedTicket_AUTO = async(req, res) => {
    let ticketID;
    connection.collection("tickets").findOneAndUpdate({"camundaID": req.body.camundaID} ,{"$set": {"status": 15}}, (err, res) => {
        if(err) throw err;
        ticketID = res.value._id;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: req.body.user_id, action: 'Abandoned Ticket - Close', desc: "Abanoned Ticket was closed by Staff member ", staffName: req.body.name}}});
    console.log("<PROCESS_MODIFIED>Ticket was automatically closed by the system as it passed the expiry date");
    res.json({status: 'success'});
};
const SolveTicket = async(req, res) => {
    let Camunda_ID;
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 7}}, (err, res) => {
        if(err) throw err;
    });

    //Creating history, creating object on the fly without schema as it DOES differ from every other previous request
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {date: new Date().toISOString(), staffId: user_id, action: 'Ticket Solved', desc: "Ticket Solved by Staff member", staffName: name}}});

    console.log("<PROCESS_MODIFIED>Staff just solved a ticket");

    // Camunda needs to be notified of the process modification too
    // Getting the new task ID (if task is modified in any way then new ID is generated by Camunda)
    await fetch(`http://localhost:8080/engine-rest/task?processInstanceId=${req.body.camundaID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => Camunda_ID = json[0].id).catch((err) => console.log(err));

    const requestBody =  {
        "variables": {
        "reAlloc": {"value":"false","type":"String"}, // We are not reallocating the ticket
        "suspend": {"value":"false","type":"String"}, // We are not suspending the ticket
        "solve": {"value":"true","type":"String"}, // We're solving the ticket
        "ticketID": {"value": `${req.body.ticketID}`,"type":"String"} // Ticket ID used by Camunda
        }
    };
    await fetch(`http://localhost:8080/engine-rest/task/${Camunda_ID}/complete`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
    })
    .catch((err) => console.log(err));

    res.json({status: 'success'});
};
const ReallocateTicket = async(req, res) => {
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];
    connection.collection("tickets").findOneAndUpdate({"_id": ObjectId(req.body.ticketID)} ,{"$set": {"status": 6, "currentSupportStaff": 'free', "staffId": 'free'}}, (err, res) => {
        if(err) throw err;
    });
    //History
    connection.collection("ticketHistory").updateOne({"ticketID": req.body.ticketID},{"$push":{records: {staffId: user_id, action: 'Ticket Reallocated', desc: "Ticket Rellocated by Staff member ", staffName: name, date: new Date().toISOString()}}});
    console.log("<PROCESS_MODIFIED>Support Staff member just reallocated a ticket.");

    // Finally, let Camunda know via REST call 
    let Camunda_ID;
    // The payload
    requestBody =  {
        "variables": {
        "suspend": {"value": "false", "type":"String"},
        "solve": {"value":"false","type":"String"},
        "cancelBySupport": {"value":"false","type":"String"},
        "reAlloc": {"value": "true", "type": "String"}
        }
    };
    // Getting the new ID
    await fetch(`http://localhost:8080/engine-rest/task?processInstanceId=${req.body.camundaID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => Camunda_ID = json[0].id).catch((err) => console.log(err));

    // Complete the task
    await fetch(`http://localhost:8080/engine-rest/task/${Camunda_ID}/complete`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
    })
    .catch((err) => console.log(err));

    res.json({status: 'success'});
};
const OpenTicketOnBehalf = async(req, res) => {
        // Ticket ID will be populated later
        let ticketID_db;
        // Should be incoming via body from camunda
        const newTicket = new Ticket({camundaID: req.body.proc_Camunda_ID, title: req.body.ticketTitle, desc: req.body.description, createdBy: req.body.onBehalf, createdById: req.body.user_id , currentSupportStaff: req.body.username, staffId: req.body.user_id, status: 2});
        connection.collection("tickets").insertOne(newTicket, function (err, res) {
            if (err)
                throw err;
            // Assign the value of inserted ID to our variable
            ticketID_db = res.insertedId;
            console.log("<CREATION>New Ticket was created by Support on Behalf of " + req.body.onBehalf);
            // Start after this
            const newTicketHistory = new TicketHistory({ticketID: ticketID_db, records: {staffId: req.body.user_id, action: 'Ticket Created on Behalf', desc: "Ticket Created on Behalf of "+ req.body.onBehalf +" by Staff member", staffName: req.body.name, date: new Date().toISOString()}});
            connection.collection("ticketHistory").insertOne(newTicketHistory);
            console.log("<PROCESS_MODIFIED>New Ticket was created by Support on Behalf of " + req.body.onBehalf);
        });   
        res.json({status: "ticket_created"})
};
const GetTicketHistory = (req, res) => {
   // Get ticket history for the particular ticket
   connection.collection("ticketHistory").findOne({ticketID: req.body.ticketID}, function(err, result) {
    if (err) throw err;
    res.json({history: result});
  });
};

module.exports = router;
module.exports.Register = Register;
module.exports.GetMyTickets = GetMyTickets;
module.exports.GetAvailableTickets = GetAvailableTickets;
module.exports.ClaimTicket = ClaimTicket;
module.exports.AskForMoreInformation = AskForMoreInformation;
module.exports.SuspendTicket = SuspendTicket;
module.exports.CloseTicket = CloseTicket;
module.exports.CloseExpiredTicket = CloseExpiredTicket;
module.exports.CloseAbandonedTicket = CloseAbandonedTicket;
module.exports.CloseAbandonedTicket_AUTO = CloseAbandonedTicket_AUTO;
module.exports.SolveTicket = SolveTicket;
module.exports.ReallocateTicket = ReallocateTicket;
module.exports.OpenTicketOnBehalf = OpenTicketOnBehalf;
module.exports.GetTicketHistory = GetTicketHistory;


