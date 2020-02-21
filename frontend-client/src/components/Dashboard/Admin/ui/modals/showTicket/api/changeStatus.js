import { Button, Input, Modal, Select, notification, Icon } from 'antd';
import React, { Component } from 'react';
import getStatus from "./getStatus";


const { Option } = Select;
class changeStatus extends Component {
  constructor(){
      super();
      this.state = ({
          desc: null,
      })
  }
  componentDidMount(){
      this.setState({currentStatus: this.props.ticket.status})
      console.log(this.state)
  }
  handleChange = value => {
    //Change the state of currentStatus to the current value
    this.setState({currentStatus: value});
  };
  handleChangeText = (value) => {
    this.setState({desc: value.target.value});
  };   
  updateData(){
    if(this.state.desc === '' || this.state.desc === ' ' || !this.state.desc){
        notification.open({
            message: 'ERROR',
            description:
              'Please provide the reason.',
            icon: <Icon type="warning" style={{ color: '#ff0000' }} />,
          });
          return;
    }
    fetch('/api/admin/ChangeStatus', {
        method: 'POST',
        body: JSON.stringify({ticketID: this.props.ticket.id, ticketStatus: this.state.currentStatus, desc: this.state.desc}),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json()).then((data) => {
          if(data.status === 'success'){
            notification.open({
                message: 'SUCCESS',
                description:
                  'Hooray! Staff has been successfully assigned to this ticket.',
                icon: <Icon type="smile" style={{ color: '#32cd32' }} />,
              });
              // Close modal
              this.props.hideModal(); 
          }
      }).catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="modal">
         <Modal  style={{height: '30vh'}}
          title={'Assigning staff to [' + this.props.ticket.title + ']'} wrapClassName="vertical-center-modal" visible={true} onCancel={this.props.hideModal} footer={null}>
          <div>
            <div style={{ paddingBottom: '100px'}}>
                <h3>CHANGING STATUS OF {this.props.ticket.title}</h3>
                <h6 style={{textAlign: 'center'}}>CHANGE STATUS and JUSTIFY WHY</h6>
                <div>
                <Input placeholder="Reason" onChange={this.handleChangeText}/>
                <div style={{fontWeight: 'bolder'}}> NEW STATUS: (current)
                <Select defaultValue={getStatus(this.props.ticket.status)} style={{ width: 240, marginTop: '25px'}} onChange={this.handleChange}>
                    <Option value="1">Ticket Opened</Option>
                    <Option value="2">Ticket Behalf</Option>
                    <Option value="3">Allocated to Support</Option>
                    <Option value="4">Allocated to Support(Self)</Option>
                    <Option value="5">Ticket Checked</Option>
                    <Option value="6">Ticket reallocated</Option>
                    <Option value="7">Ticket Solved</Option>
                    <Option value="8">Ticket Reopened</Option>
                    <Option value="9">Ticket Suspended</Option>
                    <Option value="10">More info needed</Option>
                    <Option value="11">Ticket Closed</Option>
                    <Option value="12">Ticket Exired(CLS)</Option>
                    <Option value="13">Ticket cancelled by Support</Option>
                    <Option value="14">Ticket cancelled by User</Option>
                    <Option value="15">Ticket abandoned(CANCEL)</Option>
                </Select>
                </div>
                <Button block size="large" onClick={() => this.updateData()}>Update</Button>
                </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default changeStatus;