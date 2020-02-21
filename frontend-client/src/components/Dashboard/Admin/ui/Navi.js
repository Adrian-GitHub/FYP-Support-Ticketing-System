import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';

// Modal, new ticket creation
import NewTicket from './modals/Ticket_Modal';

export default class Navi extends React.Component {
    constructor(){
      super();
      this.setState({
        newTicket: null,
      })
    }
    render(){
      const newTicket = this.state;
      return (
        <>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Ticket Support System</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#Tickets">Tickets</Nav.Link>
              <Nav.Link href="#Staff">Staff</Nav.Link>
              <Nav.Link onClick={() => this.setState({newTicket: true})}>New Ticket</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Navbar>

          {newTicket ? NewTicket() : null }
      </>
      );
    }
}