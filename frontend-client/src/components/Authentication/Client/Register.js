import React, {Component} from 'react';
import {Link} from "react-router-dom";

import {Form, Button} from 'react-bootstrap';

import '../../Main.css';
// Alerts
import Swal from 'sweetalert2';
// Functions
import registerUser from './api_client';

class Registration extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            username: "",
            password: "",
            retypedPassword: "",
        };
    }
    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };
    verify = e => {
        e.preventDefault();
        const {name, username, password, retypedPassword} = this.state;
        if(password !== retypedPassword){
            Swal.fire('Password error','They don\'t match!','error');
        }
        else {
            registerUser(name, username, password).then((value) => {
                if(value){
                    this.props.history.push("/login"); // "Success"
                }
            });
        }
    }
    render() {       
        return(
        <div className="Register">
            <div className="Reg-Header">CLIENT REGISTER</div>
            <Link to="/" className="goBack"><i>&larr;</i> Back to home</Link>
            <Form onSubmit={this.verify}>
            <Form.Group controlId="name" size="lg">
                    <Form.Label>Name</Form.Label>
                    <Form.Control onChange={this.onChange} value={this.state.name} autoFocus name="name" placeholder="Your Real Name" required/>
                </Form.Group>
                <Form.Group controlId="username" size="lg">
                    <Form.Label>Username</Form.Label>
                    <Form.Control onChange={this.onChange} value={this.state.username} name="username" placeholder="Anything" required/>
                </Form.Group>
                <Form.Group controlId="password" size="lg">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={this.onChange} value={this.state.password} minLength="3" name="password" placeholder="Minimum 3 characters long" required type="password"/>
                </Form.Group>
                <Form.Group controlId="retypedPassword" size="lg">
                    <Form.Label>Retype Password</Form.Label>
                    <Form.Control onChange={this.onChange} value={this.state.retypedPassword} minLength="3" name="retypedPassword" placeholder="Minimum 3 characters long" required type="password"/>
                </Form.Group>
                <Button block size="lg" type="submit">Register</Button>
            </Form>
           
        </div>
        
        )};
}
export default Registration;

