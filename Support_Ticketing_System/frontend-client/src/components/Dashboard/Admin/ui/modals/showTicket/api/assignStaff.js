import { Modal, List, Typography, notification, Icon } from 'antd';
import React, { Component } from 'react';

const listData = [];
class assignStaff extends Component {
    componentDidMount(){
      // Start from 0 on load
      listData.length = 0;
        fetch('/api/admin/GetStaffList', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            }
          }).then((res) => res.json()).then((data) => {
            const responseData = data.staffData;
            responseData.forEach(element => {
              listData.push({
                id: element._id,
                name: element.name,
                username: element.username
              });
              this.setState({update: true})
            });     
        }).catch((error) => {
            console.log(error);
          });
    };
  assignStaff(id, name, ticketID){
    fetch('/api/admin/AssignStaff', {
      method: 'POST',
      body: JSON.stringify({id: id, name: name, ticketID: ticketID}),
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res) => res.json()).then((data) => {
      if(data.status === 'success'){
        notification.open({
          message: 'Staff assigned!',
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
                <h3>PLEASE SELECT THE STAFF MEMBER</h3>
                <h6 style={{textAlign: 'center'}}>TO ASSIGN OR RE-ASSIGN TO THIS TICKET</h6>
                <div>
                <List style={{ height: '35vh', overflow: 'auto'}}
                  header={<div style={{textAlign: 'center'}}>STAFF LIST || FORMAT: [USR] NAME </div>}
                  footer={<h6 style={{textAlign: 'center'}}>By clicking you're assigning</h6>}
                  bordered
                  dataSource={listData}
                  renderItem={item => (
                    <List.Item onClick={() => this.assignStaff(item.id, item.name, this.props.ticket.id)}>
                      <Typography.Text mark>[{item.username}]</Typography.Text> {item.name}
                    </List.Item>
                  )}
                />
                </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default assignStaff;