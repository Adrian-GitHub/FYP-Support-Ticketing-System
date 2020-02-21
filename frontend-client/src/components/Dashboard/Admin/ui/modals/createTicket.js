export default async function createTicket(data) {
    const parsedData = JSON.parse(data);
  // Create new ticket
  const newTicket = {
    title: parsedData[0],
    createdBy: parsedData[1],
    description: parsedData[2],
    // adding one because array starts at 0-14, but actual values are 1-15
    ticketState: Number(parsedData[3]) + 1,
    currentStaff: parsedData[4]
  };
  //fetch request, sending user's data to our server
  return await fetch('/api/admin/NewTicket', {
    method: 'POST',
    body: JSON.stringify(newTicket),
    headers: {
      "Content-Type": "application/json"
    }
  }).then((res) => res.json()).then((data) => {
    // ticket was succesfully created
    if (data.status === "ticket_created") {      
      return true;
    }
    else {
      return false;
    }
  }).catch((error) => {
    console.log(error);
  });
}
