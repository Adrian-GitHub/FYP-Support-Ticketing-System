const express = require("express");
const router = express.Router();
// Fetch statement
const fetch = require('node-fetch');

// Create new ticket on behalf(support route)
const createTicketOnBehalf = (req, res) => {
    // Whatever was passed into this function it now goes to Camunda
    const username = req.cookies['username'];
    const name = req.cookies['name'];
    const user_id = req.cookies['user_id'];

    const requestBody =  {
            "variables": {
              "theOpeningEntity": {"value":"false","type":"String"}, // false for support
              "ticketTitle": {"value":`${req.body.ticketTitle}`, "type": "String"},
              "ticketDesc": {"value":`${req.body.ticketDesc}`, "type": "String"},
              "ticketBehalf": {"value":`${req.body.onBehalf}`, "type": "String"},
              "username": {"value":`${username}`, "type": "String"},
              "name": {"value":`${name}`, "type": "String"},
              "user_id": {"value":`${user_id}`, "type": "String"}
            }
    };
    fetch('http://localhost:8080/engine-rest/process-definition/key/TicketingSystem/start', {
            method: 'POST',
            body: JSON.stringify(requestBody),  //client
            headers: { 'Content-Type': 'application/json' },
      })
   .catch((err) => console.log(err));
   res.json({status: "ticket_created"})
}
// Create new ticket (client route)
const createTicket = (req, res) => {
  // Whatever was passed into this function it now goes to Camunda
  const username = req.cookies['username'];
  const name = req.cookies['name'];
  const user_id = req.cookies['user_id'];

  const requestBody =  {
          "variables": {
            "theOpeningEntity": {"value":"true","type":"String"}, // true for client
            "ticketTitle": {"value":`${req.body.ticketTitle}`, "type": "String"},
            "ticketDesc": {"value":`${req.body.ticketDesc}`, "type": "String"},
            "username": {"value":`${username}`, "type": "String"},
            "name": {"value":`${name}`, "type": "String"},
            "user_id": {"value":`${user_id}`, "type": "String"}
          }
  };
  fetch('http://localhost:8080/engine-rest/process-definition/key/TicketingSystem/start', {
          method: 'POST',
          body: JSON.stringify(requestBody),  //client
          headers: { 'Content-Type': 'application/json' },
    })
  .catch((err) => console.log(err));
  res.json({status: "success"})
}
// Close Abandoned Ticket (support route)
const closeAbandonedTicket = async(req, res) => {
  // Details of the user and Camunda ID
  const name = req.cookies['name'];
  const user_id = req.cookies['user_id'];
  let Camunda_ID;
  // Make a call to Camunda saying that the ticket is ready to be closed
  // The payload
  const requestBody =  {
    "variables": {
    "abandonedBy_user_id": {"value":`${name}`,"type":"String"},
    "abandonedBy_name": {"value":`${user_id}`,"type":"String"},
    "suspendMOREINFO": {"value":"false","type":"String"},
    "suspendByABD": {"value":"true","type":"String"} 
    }
  };
  // The call
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
}
// End Ticket's lifecycle by closing it after solving and it is expired i.e. a week after last activity (support route)
const closeExpiredTicket = async(req, res) => {
  // Give Camunda a call, Camunda will close the ticket
  // The payload for Camunda
  const requestBody =  {
    "variables": {
    "solveByClose": {"value":`"false"`,"type":"String"},
    "solveByExp": {"value":"true","type":"String"},
    "expiredBy_name": {"value":`${req.cookies['name']}`,"type":"String"},
    "expiredBy_user_id": {"value":`${req.cookies['user_id']}`,"type":"String"}
    }
  };
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
}
// End Ticket's lifecycle by closing it even if it's not expired aka successfully solved ticket without further ado
const closeTicket = async(req, res) => {
  const name = req.cookies['name'];
  const user_id = req.cookies['user_id'];
      // Let Camunda know that the ticket is now closed
    // Getting the new task ID (if task is modified in any way then new ID is generated by Camunda)
    let Camunda_ID;
    await fetch(`http://localhost:8080/engine-rest/task?processInstanceId=${req.body.camundaID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => Camunda_ID = json[0].id).catch((err) => console.log(err));
    // The function here has two jobs. One is to close the ticket after solving it, other one is to close the ticket without solving it.
    // To determine which is which, we will send ticket status here via REQ.BODY and determine which requestBody to use
    let requestBody;
    if(req.body.ticketStatus === 'Ticket Solved')
    {
        requestBody =  {
                "variables": {
                "solveByClose": {"value": "true", "type":"String"},
                "solveByExp": {"value":"false","type":"String"},
                "closedBy_name": {"value":`${name}`,"type":"String"},
                "closedBy_user_id": {"value": `${user_id}`,"type":"String"},
                "ticketID": {"value": `${req.body.ticketID}`,"type":"String"}
                }
            };
    }
    if(req.body.ticketStatus === 'Ticket Behalf' || req.body.ticketStatus === 'Ticket Opened')
    {
        // If Ticket Status is on Behalf or other that means the ticket wasn't solved yet and the support decided to close it down perhaps due to the ticket being non-informative.
        requestBody =  {
            "variables": {
            "suspend": {"value": "false", "type":"String"},
            "solve": {"value":"false","type":"String"},
            "cancelBySupport": {"value":"true","type":"String"},
            "reAlloc": {"value": "false", "type": "String"},
            "closedBy_name": {"value":`${name}`,"type":"String"},
            "closedBy_user_id": {"value": `${user_id}`,"type":"String"},
            "ticketID": {"value": `${req.body.ticketID}`,"type":"String"}
          }
        };
    }
    await fetch(`http://localhost:8080/engine-rest/task/${Camunda_ID}/complete`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
    }).catch((err) => console.log(err));

    res.json({status: 'success'});
}
module.exports = router;
module.exports.createTicket = createTicket;
module.exports.closeTicket = closeTicket;
module.exports.closeExpiredTicket = closeExpiredTicket;
module.exports.closeAbandonedTicket = closeAbandonedTicket;
module.exports.createTicketOnBehalf = createTicketOnBehalf;