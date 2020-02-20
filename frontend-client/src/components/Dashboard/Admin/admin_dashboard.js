import React, {Component} from 'react';

// Navbar
import Navi from './ui/Navi';
// Welcome header
import WelcomeHeader from './ui/Welcome';
// Statitics from DB, show the overall record count
import Statistics from './ui/Stats';
// Ticket list, latest tickets, paginated.
import TicketList from './ui/TicketList';

import 'antd/dist/antd.css'; 

// Array for ticket data
const ticketData = [];

class admin_dashboard extends Component {
      constructor(){
        super();
        this.setState({ update: false });
      }
      //After mounting, fetch the data from DB and feed it to the components
      componentDidMount(){
          fetch('/api/admin/GetTickets', {
            // Just making  POST request without body as we don't have anything particular in mind as we want it all
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }}).then((res) => res.json()).then((data) => { // make response data accessible by dot notation
              // Assign the returned response into our state object
              const returnedData = data.files;
              returnedData.forEach(element => {
                const date = new Date(element.creationDate).toLocaleString();
                ticketData.push({
                  id: element._id,
                  title: element.title,
                  createdBy: element.createdBy,
                  creationDate: date,
                  desc: element.desc,
                  currentStaff: element.currentSupportStaff,
                  stage: element.stage,
                  status: element.status
                });
                // Refresh
                this.setState({ update: true });
              });
            }).catch((error) => {
                console.log(error);
            });    
      }
      render() {
        return (
            <div>
                <Navi />
                <WelcomeHeader name={"admin_the_boss"}/>
                <Statistics ticketData={ticketData} />
                <TicketList data={ticketData} />
            </div>
        );
      }
}

export default admin_dashboard;

