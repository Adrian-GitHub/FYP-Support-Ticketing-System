import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

// Screens
// Welcome Screen
import Main from "./components/Main.js";
// Authentication Screens
//      REGISTER
import Create_Admin from "./components/Authentication/Admin/Register";
import Create_Support from "./components/Authentication/Support/Register";
import Create_Client from "./components/Authentication/Client/Register";
//      LOGIN
import Login from "./components/Authentication/Shared/Login";
// Dashboard Screens
import Admin_Dashboard from "./components/Dashboard/Admin/admin_dashboard";
import Support_Dashboard from "./components/Dashboard/Support/support_dashboard";
import Client_Dashboard from "./components/Dashboard/Client/client_dashboard";
// Profile Screens
import Client_Profile from "./components/Dashboard/Client/ui/AccountSettings";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Route exact path="/"                       component={Main}/>
                    <Route exact path="/Admin_Reg"              component={Create_Admin}/>
                    <Route exact path="/Support_Reg"            component={Create_Support}/>
                    <Route exact path="/Client_Reg"             component={Create_Client}/>
                    <Route exact path="/Login"                  component={Login}/>
                    <Route exact path="/Admin_Dashboard"        component={Admin_Dashboard}/>
                    <Route exact path="/Support_Dashboard"      component={Support_Dashboard}/>
                    <Route exact path="/Dashboard"              component={Client_Dashboard}/>
                    <Route exact path="/Profile"                component={Client_Profile}/>
                </div>
            </Router>
        );
    }
}
export default App;

