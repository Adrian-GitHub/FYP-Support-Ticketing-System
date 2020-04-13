const fetch = require('node-fetch');
const {
  Client,
  logger,
  Variables
} = require("camunda-external-task-client-js");
// configuration for the Client:
//  - 'baseUrl': url to the Workflow Engine
//  - 'logger': utility to automatically log important events
const config = {
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger
};

// create a Client instance with custom configuration
const client = new Client(config);

// create a handler for the task
const ticketCreation_HANDLER = async ({ task, taskService }) => {
  // openingEntity true/false => client/support
  const theOpeningEntity = task.variables.get("theOpeningEntity");
  const ticket_title = task.variables.get("ticketTitle");
  const ticket_desc = task.variables.get("ticketDesc");
  const ticket_behalf = task.variables.get("ticketBehalf");
  const name = task.variables.get("name");
  const username = task.variables.get("username");
  const user_id = task.variables.get("user_id");

  // complete the task
  try {
    await taskService.complete(task, theOpeningEntity);
    // After completion of the task, we will now send a FETCH request to the back-end to store this ticket in the database
    // if support
    if(theOpeningEntity === 'false'){
      fetch('http://localhost:3001/api/support/OpenTicketOnBehalf', {
        method: 'POST',
        body: JSON.stringify({proc_Camunda_ID: task.processInstanceId, ticketTitle: ticket_title, ticketDesc: ticket_desc, onBehalf: ticket_behalf, name: name, username: username, user_id: user_id }),
        headers: {
          "Content-Type": "application/json"
        }
      }).catch((error) => {
        console.log(error);
      });
      console.log('Ticket created successfully on behalf by Support')
    }
    // if client
    else if(theOpeningEntity === 'true'){
      fetch('http://localhost:3001/api/ticket/CreateTicket', {
        method: 'POST',
        body: JSON.stringify({camundaID: task.processInstanceId, ticketTitle: ticket_title, ticketDesc: ticket_desc, name: name, username: username, user_id: user_id }),
        headers: {
          "Content-Type": "application/json"
        }
      }).catch((error) => {
        console.log(error);
      });
      console.log('Ticket created successfully by Client')
    }
  } catch (e) {
    console.error(`Failed completing my task, ${e}`);
  }
};
// create a handler for the task
const onBehalf_HANDLER = async ({ task, taskService }) => {
  // On this stage, the ticket just moves onto the next field as it was created by Staff that means it is already allocated
  // Complete the task
  try {
    await taskService.complete(task);
    console.log(`Ticket allocated to Staff member`);
  } catch (e) {
    console.error(`Failed completing my task, ${e}`);
  }
};
const openTicket_HANDLER = async ({ task, taskService }) => {
  // Move the ticket status to allocation process
  // Complete the task
  try {
    await taskService.complete(task);
    console.log('Ticket is placed into the allocation process');
  } catch (e) {
    console.error(`Failed completing my task, ${e}`);
  }
};
const abandonedTicket_HANDLER = async ({ task, taskService }) => {
  // The ticket is abandoned which means that either the user hasn't responded within the given timeframe or support staff decided to do it

  // There are 2 paths, Suspend by Support or Suspend due to the "late response"
  const suspendBy_MoreInfo = task.variables.get("suspendMOREINFO");
  const suspendBy_Abandoned = task.variables.get("suspendByABD");
  if(suspendBy_MoreInfo === 'true'){
    // 1. We complete the task this results in the process being finished
    try {
      // 2.0 get proc id before its removed from the system
      const proc_id = task.processInstanceId;
      console.log(task.variables.getAll());
      // 1.1 Complete the task
      await taskService.complete(task);
      // 2. We let the database know that such occurrance happened; we will send camundaID to lookup the ticket(ID IS ALWAYS UNIQUE)
      fetch('http://localhost:3001/api/support/CloseAbandonedTicket_AUTO', {
        method: 'POST',
        body: JSON.stringify({camundaID: proc_id, name: "CAMUNDA", user_id: "AUTOMATIC CAMUNDA BEHAVIOUR"}),
        headers: {
          "Content-Type": "application/json"
        }
      }).catch((error) => {
        console.log(error);
      });
    } catch (e) {
      console.error(`Failed completing my task, ${e}`);
    }
    // 3. Print a command line statement just to confirm what happened.
    console.log('Abandoned Ticket has been removed from the database as it reached the end of the timer');
  }
  else if(suspendBy_Abandoned === 'true'){
    // In this path, we need more details sent to us than in first, let's get them in first
    const abandonedBy_name = task.variables.get("abandonedBy_name");
    const abandonedBy_user_id = task.variables.get("abandonedBy_user_id");
    const ticketID = task.variables.get("ticketID");

    // Now, call the backend API of the application(not camunda) and let it know that the ticket might be closed
    fetch('http://localhost:3001/api/support/CloseAbandonedTicket', {
      method: 'POST',
      body: JSON.stringify({ticketID: ticketID, user_id: abandonedBy_user_id, name: abandonedBy_name}),
      headers: {
        "Content-Type": "application/json"
      }
    }).catch((error) => {
      console.log(error);
    });
    // Finally, complete the task
    await taskService.complete(task);
    // Report back
    console.log('Ticket abandoned by Staff member successfully.');
  }
};
const closeBySupport_HANDLER = async ({ task, taskService }) => {
   // Get the variables
   const name = task.variables.get("closedBy_name");
   const user_id = task.variables.get("closedBy_user_id");
   const ticketID = task.variables.get("ticketID");

   fetch('http://localhost:3001/api/support/CloseTicket', {
    method: 'POST',
    body: JSON.stringify({ticketID: ticketID, user_id: user_id, name: name}),
    headers: {
      "Content-Type": "application/json"
    }
  }).catch((error) => {
    console.log(error);
  });
  // Finally, complete the task
  try {
      await taskService.complete(task);
        // Report back
        console.log('Ticket was closed successfully by Staff member.');
  } catch (error) {
    console.error(error);
  }
};
const closeExpiredTicket_HANLDER = async ({ task, taskService }) => {
  // The ticket is expired, that's either done by the staff member or automatically by the engine
  // First path , support closure
  const solveBy_ExpireTicket = task.variables.get("solveByExp");

      // Get the variables used by both paths
      const name = task.variables.get("expiredBy_name");
      const user_id = task.variables.get("expiredBy_user_id");
      const ticketID = task.variables.get("ticketID");

  if(solveBy_ExpireTicket === 'true'){
  fetch('http://localhost:3001/api/support/CloseExpiredTicket', {
    method: 'POST',
    body: JSON.stringify({ticketID: ticketID, user_id: user_id, name: name}),
    headers: {
      "Content-Type": "application/json"
    }
  }).catch((error) => {
    console.log(error);
  });
  // Finally, complete the task
  await taskService.complete(task);
  // Report back
  console.log('Ticket was expired successfully by Staff member.');
  }
  // 2nd path, automatic expiration initiated by Camunda
  else {
    fetch('http://localhost:3001/api/support/CloseExpiredTicket', {
      method: 'POST',
      body: JSON.stringify({ticketID: ticketID, user_id: 'CAMUNDA AUTOMATIC EXPIRATION', name: 'CAMUNDA'}),
      headers: {
        "Content-Type": "application/json"
      }
    }).catch((error) => {
      console.log(error);
    });
    // Finally, complete the task
    await taskService.complete(task);
    // Report back
    console.log('Ticket was expired successfully by Staff member.');
  }

};

// susbscribe to the topic 'newTicketCreation' & provide the created handler
client.subscribe("newTicketCreation", ticketCreation_HANDLER);
client.subscribe("onBehalf", onBehalf_HANDLER);
client.subscribe("openTicket", openTicket_HANDLER);
client.subscribe("abandonedTicket", abandonedTicket_HANDLER);
client.subscribe("closeBySupport", closeBySupport_HANDLER);
client.subscribe("closeExpiredTicket", closeExpiredTicket_HANLDER);
