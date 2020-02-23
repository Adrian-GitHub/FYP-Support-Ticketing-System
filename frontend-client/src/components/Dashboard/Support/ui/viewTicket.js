import { Badge } from 'antd';
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
            ticketTitle: null,
            ticketDesc: null
        })
    }      
  render() {      
    return (
      <div>
          <div>
            <div className="ticketView">
            <h4 style={{textAlign: 'center'}}>Ticket Title: {this.props.ticket.title}</h4>
            <p className="ticketDesc"><span className="ticketDescHeader">Ticket Desc</span>: {this.props.ticket.desc}</p>
            <span style={{textAlign: 'center', display: 'block'}}>The status of the ticket is : <Badge count={this.props.ticket.status} style={{ backgroundColor: '#52c41a' }} /></span>
            <span>This ticket was created by: {this.props.ticket.createdBy} </span>
            <div className="button-toolbar centered">
                <Button onClick={() => askForMoreInformation(this.props.ticket.id) }>ASK FOR MORE INFORMATION</Button>
                <Button onClick={() => suspendTicket(this.props.ticket.id)}>SUSPEND TICKET</Button>
                <Button onClick={() => closeTicket(this.props.ticket.id)}>CLOSE TICKET</Button>
                <Button onClick={() => closeExpiredTicket(this.props.ticket.id)}>CLOSE EXPIRED TICKET</Button>
                <Button onClick={() => closeAbandonedTicket(this.props.ticket.id)}>CLOSE ABANONDED TICKET</Button>
                <Button onClick={() => solveTicket(this.props.ticket.id)}>SOLVE TICKET</Button>
                <Button onClick={() => reallocateTicket(this.props.ticket.id)}>REALLOCATE TICKET</Button>
            </div>
            </div>
            </div>
      </div>
    );
  }
}
export default withRouter(ViewTicket);