import { Badge, Divider, List, Comment } from 'antd';
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
          date: 'JUST NOW'
        }]
      });
    }
    componentDidMount(){
      this.setState({ticketHistory: []})
      const id = this.props.ticket.id;
      console.log(id)
      fetch('/api/support/GetTicketHistory', {
        method: 'POST',
        body: JSON.stringify({ticketID: id}),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json()).then((data) => {
          console.log(data);
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
                date: date
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
    let { ticketHistory } = this.state;
    return (
      <div>
          <div>
            <div className="ticketView">
            <h4 style={{textAlign: 'center'}}>Ticket Title: {this.props.ticket.title}</h4>
            <p className="ticketDesc"><span className="ticketDescHeader">Ticket Desc</span>: {this.props.ticket.desc}</p>
            <span style={{textAlign: 'center', display: 'block'}}>The status of the ticket is : <Badge count={this.props.ticket.status} style={{ backgroundColor: '#52c41a' }} /></span>
            <span>This ticket was created by: {this.props.ticket.createdBy} </span>
            <div className="button-toolbar centered-light">
                <Button onClick={() => askForMoreInformation(this.props.ticket.id) }>ASK FOR MORE INFORMATION</Button>
                <Button onClick={() => suspendTicket(this.props.ticket.id)}>SUSPEND TICKET</Button>
                <Button id="closeTicket" onClick={() => closeTicket(this.props.ticket.id)}>CLOSE TICKET</Button>
                <Button onClick={() => closeExpiredTicket(this.props.ticket.id)}>CLOSE EXPIRED TICKET</Button>
                <Button onClick={() => closeAbandonedTicket(this.props.ticket.id)}>CLOSE ABANONDED TICKET</Button>
                <Button onClick={() => solveTicket(this.props.ticket.id)}>SOLVE TICKET</Button>
                <Button onClick={() => reallocateTicket(this.props.ticket.id)}>REALLOCATE TICKET</Button>
            </div>
            </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '15vh', height: '55vh', overflow: 'auto'}}>
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