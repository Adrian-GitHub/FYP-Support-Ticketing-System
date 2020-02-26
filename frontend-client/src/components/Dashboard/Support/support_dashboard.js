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
                <Navi user={document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1") + "(" + document.cookie.replace(/(?:(?:^|.*;\s*)name\s*=\s*([^;]*).*$)|^.*$/, "$1") + ")"}/>
                <Dashboard />
            </div>
        );
      }
}

export default support_dashboard;

