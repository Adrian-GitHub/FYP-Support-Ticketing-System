import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import NewTicket from './NewTicket';
import Logout from './Logout';

// For this.props.history.push
import { withRouter} from 'react-router-dom';
class Navi extends React.Component {
    constructor(){
      super();
      this.state = ({
        newTicket: false
      })
    }
    hideModal = (e) => {
      this.setState({newTicket: false});
    }
    render(){
      const { newTicket } = this.state;
      return (
        <div style={{zIndex: '9999'}}>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/Dashboard">Support System</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.props.history.push('/profile')}>Account Settings</Nav.Link>
              <Nav.Link name="test-newTicket" onClick={() => this.setState({newTicket: true})}>New Ticket</Nav.Link>
              <Nav.Link name="test-logout" onClick={() => Logout(this.props)}>Logout</Nav.Link>
              <Nav.Link style={{pointerEvents: 'none', position: 'absolute', right: '25px', color: '#ffffff', fontWeight: 'bolder'}}>Hello {this.props.user}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Navbar>
        {newTicket && <NewTicket user={this.props.user} hide={this.hideModal} />}
        </div>
      );
    }
}
export default withRouter(Navi);