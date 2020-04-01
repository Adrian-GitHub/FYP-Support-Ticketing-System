import React, { Component } from 'react';
import { List } from 'antd';

import TicketModal from './modals/showTicket/showTicket';

import getStatus from './modals/showTicket/api/getStatus';

import './TicketList.css';

export default class TicketList extends Component {
  constructor(){
    super();   
    this.state = {
      showTicket: false,
      ticket: {
          title: 'LOADING' ,
          desc: 'LOADING' ,
          creationDate: 'LOADING' ,
          createdBy: 'LOADING' ,
          currentStaff: 'LOADING' ,
          stage: 'LOADING' ,
          status: 'LOADING' 
      }
    };
  }
  hideModal = () => this.setState({ showTicket: false });
  showTicket = (item) =>{
    this.setState({ showTicket: true , ticket: item });
  }
    render(){
      return (
          <div className="desktop">
                <List itemLayout="vertical" size="xs" pagination={{onChange: page => {console.log(page); }, pageSize: 3,}} dataSource={this.props.data} 
                    renderItem={item => (
                    <List.Item className="touchEvent" onClick={() => this.showTicket(item) } key={item.title}>
                        <List.Item.Meta
                        title={<a className="mobileText" href={item._id}>{item.title}</a>}
                        description={item.desc}
                        />
                        <div className="row">
                          <span className="submittedBy" >Submitted by: {item.createdBy}</span>
                          <span className="ticketStage" >Ticket Status: <span>{getStatus(item.status)}</span></span>
                          <span className="currentStaff" >Current Staff: <span className="currentStaff_name" >{item.currentStaff}</span></span>
                        </div>
                    </List.Item>
                    )}
                />
                {this.state.showTicket && <TicketModal ticket={this.state.ticket} hideModal={this.hideModal} /> }
            </div>
      );
    }
}