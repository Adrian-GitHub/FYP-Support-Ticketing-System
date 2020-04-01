import React from 'react';
import {Jumbotron} from 'react-bootstrap';

export default class Welcome extends React.Component {
    render(){
      return (
        <Jumbotron>
            <h1>Hello, {this.props.name}!</h1>
        </Jumbotron>
      );
    }
}