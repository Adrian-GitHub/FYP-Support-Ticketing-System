import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

export default class Navi extends React.Component {
    constructor(){
      super();
      this.state = ({
      })
    }
    render(){
      return (
        <div style={{zIndex: '9999'}}>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Support System</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link >Account Settings</Nav.Link>
              <Nav.Link >Logout</Nav.Link>
              <Nav.Link style={{pointerEvents: 'none', position: 'absolute', right: '25px', color: '#ffffff', fontWeight: 'bolder'}}>Hello {this.props.user}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Navbar>
        </div>
      );
    }
}