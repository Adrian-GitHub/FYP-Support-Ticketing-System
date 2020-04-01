import { Button, Form, Icon, Input, Modal, notification} from 'antd';
import React, { Component } from 'react';
import Swal from 'sweetalert2';

class newTicket extends Component {
    constructor(){
        super();
        this.state = ({
            ticketTitle: null,
            ticketDesc: null,
            ticketBehalf: null, 
        })
    }
    isNullOrEmpty(str){
        return !str||!str.trim();
    }
    handleSubmit = e => {
        e.preventDefault();
        const {ticketTitle, ticketBehalf, ticketDesc} = this.state;
        //Check if title contains letters or numbers
        if(!ticketTitle || this.isNullOrEmpty(ticketTitle)){
            notification.open({
                message: 'Missing title!',
                text:
                  'Please provide a valid title for your ticket.',
                icon: <Icon type="smile" rotate={180} style={{ color: '#ff0000' }} />,
              });
              return;
        }
        if(!ticketBehalf || this.isNullOrEmpty(ticketBehalf)){
          notification.open({
              message: 'On behalf of who?!',
              text:
                'Can\'t be empty, please specify a user.',
              icon: <Icon type="smile" rotate={180} style={{ color: '#ff0000' }} />,
            });
            return;
      }
      if(!ticketDesc || this.isNullOrEmpty(ticketDesc)){
        notification.open({
            message: 'Describe your ticket',
            text:
              'Can\'t be empty, please describe it.',
            icon: <Icon type="smile" rotate={180} style={{ color: '#ff0000' }} />,
          });
          return;
    }
        // We're here that means that the title is valid
        else{
            //Create a ticket
            fetch('/api/support/OpenTicketOnBehalf', {
                method: 'POST',
                body: JSON.stringify({ticketTitle: ticketTitle, ticketDesc: ticketDesc, onBehalf: ticketBehalf }),
                headers: {
                  "Content-Type": "application/json"
                }
              }).then((res) => res.json()).then((data) => {
                  if(data.status === 'ticket_created'){
                      //done
                      Swal.fire({
                          title: 'Success!',
                          icon: 'success',
                          text: `Ticket was opened on behalf of ${ticketBehalf}`
                      }).then((result) => {
                          window.location.reload();
                      });
                  }
              }).catch((error) => {
                console.log(error);
              });
        }
    };
    onChange = e => {
        this.setState({[e.target.id] : e.target.value})
        
    };
  render() {      
    return (
      <div>
         <Modal  style={{height: '30vh', width: '60vw'}}
          title={'SUPPORT || TICKET CREATION'} wrapClassName="vertical-center-modal" visible={true} onCancel={this.props.hide} footer={null}>
          <div>
            <div><h4>Opening a ticket on behalf of someone</h4></div>
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
                <Form.Item label="Title of a ticket">
                <Input id="ticketTitle" prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Title of a ticket" onChange={this.onChange}/>
                </Form.Item>
                <Form.Item label="Description">
                <Input id="ticketDesc" prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Description of a ticket" onChange={this.onChange}/>
                </Form.Item>
                <Form.Item label="On behalf of">
                <Input id="ticketBehalf" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="On Behalf of" onChange={this.onChange}/>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit">
                    Submit Ticket!
                </Button>
                </Form.Item>
            </Form>
            </div>
        </Modal>
      </div>
    );
  }
}
export default newTicket;