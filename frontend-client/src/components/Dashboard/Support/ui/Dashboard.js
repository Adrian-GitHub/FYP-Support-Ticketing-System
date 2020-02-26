import { List } from 'antd';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {getMyTickets} from './getMyTickets';
import claimTicket from './claimTicket';
import { getAvailableTickets } from './getAvailableTickets';
import ViewTicket from './viewTicket';
import { Button } from 'react-bootstrap';

const data = [
  {
      title: 'LOADING YOUR TICKETS',
      desc: 'PLEASE BEAR WITH US',
      dateCreated: 'IT WON\'T TAKE LONG'
  },
];
class Dashboard extends Component {
    state = {};
    constructor(){
        super();
        this.state = ({
            tickets: data,
            availableTickets: data,
            currentItem: {title: '', desc: '', dateCreated: '', staff: '', status: ''},
        })
    }
    // When component is "loaded", fetch ticket data corresponding to this user
    async componentDidMount(){
        const myTickets = await getMyTickets();
        this.setState({ tickets: myTickets})
        const availableTickets = await getAvailableTickets();
        this.setState({ availableTickets: availableTickets});
    }
    saveTicketInstance_save(item){
        this.setState({currentItem: item})
        //Show ticket claim modal
        claimTicket(item.id, item.title, item.createdBy);
    }
    saveTicketInstance_open(item){
        this.setState({currentItem: item, viewTicket: true})
    }
    render(){
        const {viewTicket} = this.state;
      return (
        <div className="dashboard">
            <div className="split left">
                <div>
                    <h2 className="headerLeft">YOU'RE ASSIGNED TO THESE TICKETS</h2>
                    <div>
                    <List
                    header={<div className="tixHeader">These are your tickets</div>}
                    bordered
                    dataSource={this.state.tickets}
                    renderItem={item => (
                        <List.Item onClick={() => this.saveTicketInstance_open(item)} className="item">
                            <div>
                                <h5>{item.title}</h5>
                                <p>{item.desc}</p>
                                <div className="toolbar">
                                    <div className="date">Date Created: {item.dateCreated}</div>
                                    <div className="status">Status: {item.status}</div>
                                    <div>Current Staff Member: {item.staff} </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                    />
                    </div>
                </div>
            </div>
            
            <div className="split right">
                {viewTicket && <Button variant="danger" onClick={() => this.setState({viewTicket: false})}>CLOSE</Button>}
               {viewTicket ? <ViewTicket ticket={this.state.currentItem}/>
               :
               <div>
                <h2 className="headerRight">AVAILABLE TICKETS</h2>
                    <div className="headerInnerRight">
                        <h5>YOU MAY CLAIM THESE TICKETS FOR YOURSELF</h5>
                    </div>
                    <List
                    bordered
                    dataSource={this.state.availableTickets}
                    renderItem={item => (
                        <List.Item onClick={() => this.saveTicketInstance_save(item)} className="item">
                            <div>
                                <h5>{item.title}</h5>
                                <p>{item.desc}</p>
                                <div className="toolbar" style={{display: 'block'}}>
                                    <div className="date">Date Created: {item.dateCreated}</div>
                                    <div className="status">Status: {item.status}</div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                    />
                </div>
                }
            </div>
        </div>
      );
    }
}
export default withRouter(Dashboard);