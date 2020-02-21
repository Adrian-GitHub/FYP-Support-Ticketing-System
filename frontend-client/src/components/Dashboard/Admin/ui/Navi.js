import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';

// Modal, new ticket creation
import NewTicket from './modals/Ticket_Modal';
import Staff from './modals/Staff_Modal';

export default class Navi extends React.Component {
    constructor(){
      super();
      this.state = ({
        staff: false,
      })
    }
    hideModal = (e) => {
      this.setState({staff: false});
    }
    render(){
      const { staff } = this.state;
      return (
        <>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Ticket Support System</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.setState({staff: true}) }>Staff Managment</Nav.Link>
              <Nav.Link onClick={() => NewTicket()}>New Ticket</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Navbar>

          {staff && <Staff hideModal={this.hideModal} /> }
      </>
      );
    }
}