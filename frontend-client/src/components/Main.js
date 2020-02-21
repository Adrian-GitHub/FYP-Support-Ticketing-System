import React, {Component} from "react";
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import './Main.css';

class Main extends Component {
    render() {
        return (
            <div>
                <div className="logo">
                    <h1>TICKETING SUPPORT SYSTEM</h1>
                </div>
            <ButtonToolbar className="align-buttons">
                <h3>TRY ONE OF THESE</h3>
            <Button className="align-button" variant="primary" size="lg">
                <Link to="/Admin_Reg" className="white-text">ADMIN CREATE ACCOUNT</Link>
            </Button>
            <Button className="align-button" variant="primary" size="lg">
                <Link to="/Support_Reg"  className="white-text">SUPPORT CREATE ACCOUNT</Link>
            </Button>
            <Button className="align-button" variant="primary" size="lg">
                <Link to="/Client_Reg" className="white-text">CLIENT CREATE ACCOUNT</Link>
            </Button>
          </ButtonToolbar>
          <ButtonToolbar className="align-button">
                <h3>OR THIS ONE IF TOP ONES AREN'T USEFUL</h3>
                <div className="button">
                    <Button variant="primary" size="lg">
                        <Link to="/Login" className="white-text">LOGIN</Link>
                    </Button>
                </div>
          </ButtonToolbar>
          </div>
        );
    }
}
export default Main;

