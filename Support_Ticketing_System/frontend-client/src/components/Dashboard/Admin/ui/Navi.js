import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import Staff from './modals/Staff_Modal';
// Modal, new ticket creation
import NewTicket from './modals/Ticket_Modal';
// Logout
import Logout from './Logout';
// For this.props.history.push
import { withRouter} from 'react-router-dom';

class Navi extends React.Component {
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
              <Nav.Link name="test-logout" onClick={() => Logout(this.props)}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Navbar>

          {staff && <Staff hideModal={this.hideModal} /> }
      </>
      );
    }
}
export default withRouter(Navi);
