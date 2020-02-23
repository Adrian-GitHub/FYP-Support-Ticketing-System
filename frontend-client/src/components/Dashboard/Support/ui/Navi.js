import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import TicketOnBehalf from './OpenTicketOnBehalf';
import Logout from './Logout';

// For this.props.history.push
import { withRouter} from 'react-router-dom';
class Navi extends React.Component {
    constructor(){
      super();
      this.state = ({
        ticketOnBehalf: false
      })
    }
    hideModal = (e) => {
      this.setState({TicketOnBehalf: false});
    }
    render(){
      const { ticketOnBehalf } = this.state;
      return (
        <div style={{zIndex: '9999'}}>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/Dashboard">Support System | CONTROL CENTRE</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.setState({ticketOnBehalf: true})}>Open Ticket on Behalf</Nav.Link>
              <Nav.Link onClick={() => Logout(this.props)}>Logout</Nav.Link>
              <Nav.Link style={{pointerEvents: 'none', position: 'absolute', right: '25px', color: '#ffffff', fontWeight: 'bolder'}}>Welcome Staf Member: {this.props.user}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Navbar>
        {ticketOnBehalf && <TicketOnBehalf user={this.props.user} hide={this.hideModal} />}
        </div>
      );
    }
}
export default withRouter(Navi);