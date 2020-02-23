import React, { Component } from 'react';
// Navbar
import Navi from './ui/Navi';
// Main Screen
import Dashboard from './ui/Dashboard';

class support_dashboard extends Component {
      constructor(){
        super();
        this.setState({ update: false });
      }
      render() {
        return (
            <div>
                <Navi user={'hieee'}/>
                <Dashboard />
            </div>
        );
      }
}

export default support_dashboard;

