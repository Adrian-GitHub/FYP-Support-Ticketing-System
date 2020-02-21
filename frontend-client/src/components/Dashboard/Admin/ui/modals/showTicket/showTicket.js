import React, {Component} from 'react';
import {Modal, Button} from 'antd';
import getStatus from './api/getStatus';

import './showTicket.css';

// Custom modals, for functions
import AssignStaff from "./api/assignStaff";
import ChangeStatus from "./api/changeStatus";
import { deleteModal } from './api/deleteModal';
import { askForMoreInfo } from './api/askForMoreInfo';

class showTicket extends Component {
  constructor(){
    super();
    this.state = {
      assignStaffModal: false,
      changeStatusModal: false,
      deleteModal: false,
      ask4moInfoModal: false,
    }
  }
  hideModal = (e) => {
    this.setState({assignStaffModal: false, changeStatusModal: false, deleteModal: false, ask4moInfoModal: false});
  }
  render() {
    return (
      <div className="modal">
         <Modal
          title={'Ticket [' + this.props.ticket.title + ']'} wrapClassName="vertical-center-modal" visible={true} onCancel={this.props.hideModal} footer={null}>
          <div>
            <span><span style={{fontWeight: 'bolder'}}>[DESCRIPTION]</span>: {this.props.ticket.desc}</span>
            <span style={{display: 'block'}}><span style={{fontWeight: 'bolder'}}>[Submitted By]</span>: {this.props.ticket.createdBy}</span>
            <span style={{display: 'block'}}><span style={{fontWeight: 'bolder'}}>[Current Staff]</span>: {this.props.ticket.currentStaff}</span>
            <span style={{display: 'block'}}><span style={{fontWeight: 'bolder'}}>[Ticket Status]</span>: <span style={{color: 'limegreen', fontWeight: 'bolder'}}>{getStatus(this.props.ticket.status)}</span></span>
            <span style={{display: 'block'}}><span style={{fontWeight: 'bolder'}}>[Created On]</span>: {this.props.ticket.creationDate}</span>
            <div>
                <h3 className="options">OPTIONS</h3>
                <div className="buttons">
                  <Button type="primary" onClick={() => this.setState({assignStaffModal:  true})}>Assign Staff</Button>
                  <Button type="primary" onClick={() => this.setState({changeStatusModal: true})}>Change Status</Button>
                  <Button type="danger"  onClick={() => this.setState({deleteModal:       true})}>Delete</Button>
                  {this.props.ticket.status !== 10 && <Button type="primary" onClick={() => this.setState({ask4moInfoModal:   true})}>Ask for more information</Button>}
                </div>
            </div>
          </div>
        </Modal>
        {/* Assign Staff Modal */}
        {this.state.assignStaffModal && <AssignStaff id="assignStaffModal" ticket={this.props.ticket} hideModal={this.hideModal} /> }
        {/* Change Stage Modal */}
        {this.state.changeStatusModal && <ChangeStatus id="changeStatusModal" ticket={this.props.ticket} hideModal={this.hideModal} /> }
        {/* Change Status Modal */}
        {/* Delete Modal */}
        {this.state.deleteModal && deleteModal(this.props.ticket) }
        {/* Ask for more information Modal */}
        {this.state.ask4moInfoModal && askForMoreInfo(this.props.ticket.id) }
      </div>
    );
  }
}
export default showTicket;