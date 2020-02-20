import React, {Component} from 'react';
import { Link } from "react-router-dom";
// Bootstrap design
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import loginUser from './api_shared';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: ""
        };
    }
    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };
    verify = e => {
        e.preventDefault();
        const {username, password } = this.state;
        loginUser(username, password).then((value) => {
            if(value === "admin"){
                this.props.history.push("/Admin_Dashboard");
            }
            else if(value === "support"){
                this.props.history.push("/Support_Dashboard");
            }
            else if(value === "client"){
                this.props.history.push("/Dashboard");
            }
        });
    }
    render() {
        return (
            <div className="Login">
                <div className="Log-Header">LOGIN</div>
                    <Link to="/" className="goBack"><i>&larr;</i> Back to home</Link>
                    <Form onSubmit={this.verify}>
                        <Form.Group controlId="username" size="lg">
                            <Form.Label>Username</Form.Label>
                            <Form.Control autoFocus onChange={this.onChange} value={this.state.username} name="username" placeholder="Username" required/>
                        </Form.Group>
                        <Form.Group controlId="password" size="lg">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={this.onChange} value={this.state.password} name="password" placeholder="Your password" required type="password"/>
                        </Form.Group>
                        <Button block size="lg" type="submit">Login</Button>
                    </Form>
            </div>
            );
        }
    }

export default Login;

