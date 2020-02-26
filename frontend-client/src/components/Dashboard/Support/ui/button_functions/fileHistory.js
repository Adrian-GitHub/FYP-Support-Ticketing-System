import { Badge, Modal } from 'antd';
import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from 'react-bootstrap'

class FileHistory extends Component {
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
        <Modal>
            <div>
              <div className="ticketView">
              <h4 style={{textAlign: 'center'}}>History of Ticket: NAME</h4>
              </div>
              </div>
        </Modal>
        </div>
    );
  }
}
export default withRouter(FileHistory);