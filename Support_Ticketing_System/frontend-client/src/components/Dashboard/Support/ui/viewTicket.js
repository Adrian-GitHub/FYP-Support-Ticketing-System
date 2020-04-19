import { Badge, Divider, List } from 'antd';
import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from 'react-bootstrap'
import { askForMoreInformation } from './button_functions/askForMoreInformation';
import { reallocateTicket } from './button_functions/reallocateTicket';
import { closeTicket } from './button_functions/closeTicket';
import { suspendTicket } from './button_functions/suspendTicket';
import { closeExpiredTicket } from './button_functions/closeExpiredTicket';
import { closeAbandonedTicket } from './button_functions/closeAbandonedTicket';
import { solveTicket } from './button_functions/solveTicket';

class ViewTicket extends Component {
    constructor(){
      super();
      this.state = ({
        ticketHistory: [{
          action: 'LOADING',
          desc: 'ALMOST THERE',
          staffName: 'SYSTEM',
          date: 'JUST NOW',
          message: 'X'
        }]
      });
    }
    componentDidMount(){
      this.setState({ticketHistory: []})
      const id = this.props.ticket.id;
      fetch('/api/support/GetTicketHistory', {
        method: 'POST',
        body: JSON.stringify({ticketID: id}),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json()).then((data) => {
          //temp var
          let dbData = [];
          // data from callback
          const dataTix = data.history.records;
          dataTix.forEach(element => {
              const date = new Date(element.date).toLocaleString();
                dbData.push({
                action: element.action,
                desc: element.desc,
                staffName: element.staffName,
                date: date,
                message: element.message
              })
          });
          this.setState({ticketHistory: dbData});
      }).catch((error) => {
        console.log(error);
      });
    }
    //if component refreshes, check what if props are different to the current ones
    componentDidUpdate(prevProps){
      if (this.props.ticket.id !== prevProps.ticket.id) {
        this.componentDidMount();
      }
    }    
  render() {      
    /*
    From Stage 5 staff member can:
    Reallocate the ticket(Stage6)
    Solve The Ticket(Stage7)
    Cancel(close) the ticket (Stage 13)

    Stage 9 (suspend the ticket) consists of different stages:
      Stage 10 - ASK FOR MORE INFORMATION
      Stage 15 - Cancel abandoned ticket
    */

    // Stage booleans
    let ask4moInfo_boolean = true,
    suspendTicket_boolean = true, 
    closeTicket_boolean = true, 
    closeExpiredTicket_boolean = true, 
    closeAbandonedTicket_boolean = true,
     solveTicket_boolean = true, reallocTicket_boolean = true;
    
    // Decide which buttons to show
    // Stage 5
    if(this.props.ticket.status === 'Ticket Opened' || this.props.ticket.status ==='Ticket Behalf' || this.props.ticket.status === 'Ticket Checked' || this.props.ticket.status === 'Allocated to Support' || this.props.ticket.status === 'Ticket reallocated') {
      suspendTicket_boolean = false;
      reallocTicket_boolean = false;
      solveTicket_boolean = false;
      closeTicket_boolean = false;
    }
    // Stage 7
    else if(this.props.ticket.status === 'Ticket Solved') {
      closeExpiredTicket_boolean = false;
      closeTicket_boolean = false;
    }
    // Stage 9
    else if(this.props.ticket.status === 'Ticket Suspended') {
      ask4moInfo_boolean = false;
      closeAbandonedTicket_boolean = false;
    }

    let { ticketHistory } = this.state;
    console.log(this.props.ticket)
    return (
      <div>
          <div>
            <div className="ticketView">
            <h4 style={{textAlign: 'center'}}>Ticket Title: {this.props.ticket.title}</h4>
            <p className="ticketDesc"><span className="ticketDescHeader">Ticket Desc</span>: {this.props.ticket.desc}</p>
            <span style={{textAlign: 'center', display: 'block'}}>The status of the ticket is : <Badge count={this.props.ticket.status} style={{ backgroundColor: '#52c41a' }} /></span>
            <span>This ticket was created by: {this.props.ticket.createdBy} </span>
            <div className="button-toolbar centered-light">
              {/*  This buttons are visible depending on the stage of a ticket.
              // Everything in here happens after Stage 5 (corresponding to the diagram) */}
                <Button disabled={ask4moInfo_boolean} id="ask4moInfo" onClick={() => askForMoreInformation(this.props.ticket.id, this.props.ticket.camundaID) }>ASK FOR MORE INFORMATION</Button>
                <Button disabled={suspendTicket_boolean} id="suspendTicket" onClick={() => suspendTicket(this.props.ticket.id, this.props.ticket.camundaID)}>SUSPEND TICKET</Button>
                <Button disabled={closeTicket_boolean} id="closeTicket" onClick={() => closeTicket(this.props.ticket.id, this.props.ticket.camundaID, this.props.ticket.status)}>CLOSE TICKET</Button>
                <Button disabled={closeExpiredTicket_boolean} id="closeExpiredTicket" onClick={() => closeExpiredTicket(this.props.ticket.id, this.props.ticket.camundaID)}>CLOSE EXPIRED TICKET</Button>
                <Button disabled={closeAbandonedTicket_boolean} id="closeAbdTicket" onClick={() => closeAbandonedTicket(this.props.ticket.id, this.props.ticket.camundaID)}>CLOSE ABANONDED TICKET</Button>
                <Button disabled={solveTicket_boolean} id="solveTicket" onClick={() => solveTicket(this.props.ticket.id, this.props.ticket.camundaID)}>SOLVE TICKET</Button>
                <Button disabled={reallocTicket_boolean} id="reallocTicket" onClick={() => reallocateTicket(this.props.ticket.id, this.props.ticket.camundaID)}>REALLOCATE TICKET</Button>
            </div>
            </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '11vh', height: '48vh', overflow: 'auto'}}>
                <h3>Ticket History</h3>
                <Divider/>
                <List
                  itemLayout="horizontal"
                  dataSource={ticketHistory}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={<span>{item.action}</span>}
                        description={item.desc}
                      />
                      Done by <span style={{fontWeight: "bolder"}}>{item.staffName}</span> @ <span style={{color: 'grey', fontStyle: 'italics'}}>{item.date}</span>
                    </List.Item>
                  )}
                />
            </div>
      </div>
    );
  }
}
export default withRouter(ViewTicket);