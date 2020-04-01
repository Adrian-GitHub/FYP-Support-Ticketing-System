import { Button, Form, Icon, Input, Modal, notification} from 'antd';
import React, { Component } from 'react';
import Swal from 'sweetalert2';

class newTicket extends Component {
    constructor(){
        super();
        this.state = ({
            ticketTitle: null,
            ticketDesc: null
        })
    }
    isNullOrEmpty(str){
        return !str||!str.trim();
    }
    handleSubmit = e => {
        e.preventDefault();
        const {ticketTitle} = this.state;
        //Check if title contains letters or numbers
        if(!ticketTitle || this.isNullOrEmpty(ticketTitle)){
            notification.open({
                message: 'Missing title!',
                description:
                  'Please provide a valid title for your ticket.',
                icon: <Icon type="smile" rotate={180} style={{ color: '#ff0000' }} />,
              });
              return;
        }
        // We're here that means that the title is valid
        else{
            //Create a ticket
            fetch('/api/client/CreateTicket', {
                method: 'POST',
                body: JSON.stringify({ticketTitle: this.state.ticketTitle, ticketDesc: this.state.ticketDesc}),
                headers: {
                  "Content-Type": "application/json"
                }
              }).then((res) => res.json()).then((data) => {
                  if(data.status === 'success'){
                      //done
                      Swal.fire({
                          title: 'Success!',
                          icon: 'success',
                          description: 'Ticket send to the support! Please allow up to 48h for response'
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
          title={'NEW TICKET CREATION'} wrapClassName="vertical-center-modal" visible={true} onCancel={this.props.hide} footer={null}>
          <div>
            <div><h3>Hello {this.props.user}</h3></div>
            <span>Please provide title of a ticket and then please describe it(The better the description, the better we can help)</span>
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
                <Form.Item label="Title of a ticket">
                <Input id="ticketTitle" prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Title of a ticket" onChange={this.onChange}/>
                </Form.Item>
                <Form.Item label="Description">
                <Input id="ticketDesc" prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Description of a ticket" onChange={this.onChange}/>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit" id="test-submit">
                    Submit
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