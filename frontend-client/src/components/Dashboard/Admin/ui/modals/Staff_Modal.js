import { Modal, Popconfirm, Table } from 'antd';
import React, { Component } from 'react';

const dummyContainer = [];
class staffModal extends Component {
    constructor(){
        super();
        this.state = ({
            dataSource: []
        });
    }
    columns = [
        {
          title: 'Staff Username',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: 'Staff Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Registered',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'Operation',
          dataIndex: 'operation',
          render: (text, record) =>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteFile(record.key)}>
                <span style={{backgroundColor: '#ff0000', border: '1px solid', color: '#ffffff', fontWeight: 'bolder', borderRadius: '25px', padding: '5px', cursor: 'pointer'}}>Delete</span>
              </Popconfirm>
        },
      ];
      deleteFile(id){
        fetch('/api/admin/DeleteUser', {
            method: 'POST',
            body: JSON.stringify({userID: id}),
            headers: {
              "Content-Type": "application/json"
            }
          }).then((res) => res.json()).then((data) => {
              if(data.status === 'success'){
                  //done
                 this.setState({dataSource: null});
                 this.componentDidMount();
              }
          }).catch((error) => {
            console.log(error);
          });
      }
      async componentDidMount(){
        await fetch('/api/admin/StaffDetails', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            }
          }).then((res) => res.json()).then((data) => {
            const responseData = data.staffData;
            //Reset container before proceeding otherwise we will end up having duplicated data
            dummyContainer.length = 0;
            responseData.forEach(element => {
                //Convert date into a human-friendly format
                const date = new Date(element.registrationDate).toLocaleString();
                dummyContainer.push({
                    key: element._id,
                    username: element.username,
                    name: element.name,
                    date: date
                })
            });
            this.setState({
                dataSource: dummyContainer
              });
          }).catch((error) => {
            console.log(error);
          });
      }
  render() {      
    return (
      <div>
         <Modal  style={{height: '30vh', width: '60vw'}}
          title={'STAFF MANAGEMENT'} wrapClassName="vertical-center-modal" visible={true} onCancel={this.props.hideModal} footer={null}>
          <div>
            <div style={{ paddingBottom: '100px'}}>
                <h3>PLEASE SELECT THE STAFF MEMBER</h3>
                <div>
                    <Table  dataSource={this.state.dataSource} columns={this.columns} pagination={{ pageSize: 4, }} />
                </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default staffModal;