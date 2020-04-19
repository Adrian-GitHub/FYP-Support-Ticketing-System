import React, { Component } from 'react';

import Navi from './Navi';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import {notification, Icon } from 'antd';

import Swal from 'sweetalert2';

import './AccountSettings.css';

class AccountSettings extends Component {
    constructor(){
        super();
        this.state = {
            userData: {
                username: 'LOADING',
                amountOfTickets: '0',
                creationDate: '00/00/00 00:00:00'
            }
        }
    }    
    componentDidMount(){
        //FETCH ALMOST FULL USER ACCOUNT DATA
           fetch('/api/client/GetUserData', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            }
          }).then((res) => res.json()).then((data) => {
              if(data.status === 'error'){
                notification.open({
                    message: 'Error!',
                    description:
                      'You must be logged in to access that data.',
                    icon: <Icon type="warning" style={{ color: '#ff0000' }} />,
                  });
                  this.props.history.push("/Login");
              }
              else {              
                //update state
                this.setState({userData: data.userData[0], ticketCount: data.ticketData});
              }
          }).catch((error) => {
            console.log(error);
          });        
    }
    async changePassword(){
        const { value: pwd } = await Swal.fire({
            title: 'Input your new password',
            input: 'password',
            inputPlaceholder: 'New password'
          })
          if(pwd){
            fetch('/api/client/ChangePassword', {
                method: 'POST',
                body: JSON.stringify({password: pwd}),
                headers: {
                  "Content-Type": "application/json"
                }
              }).then((res) => res.json()).then((data) => {
                  if(data.status === 'error'){
                    notification.open({
                        message: 'Error!',
                        description:
                          'You something went wrong! Try again',
                        icon: <Icon type="warning" style={{ color: '#ff0000' }} />,
                      });
                  }
                  else if(data.status === 'success'){              
                    Swal.fire('Success!', 'Your password was changed! Please login using new password.', 'success').then(() => {
                        // Go to login
                        this.props.history.push("/Login");
                    });
                  }
              }).catch((error) => {
                console.log(error);
              });       
          }
    }
    deleteAccount(){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                fetch('/api/client/DeleteAccount', {
                    method: 'POST',
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }).then((res) => res.json()).then((data) => {
                      if(data.status === 'success'){              
                        //update state
                        Swal.fire(
                            'Deleted!',
                            'Your Account was deleted. Sorry to see you go',
                            'success'
                        );
                        this.props.history.push("/Login");
                      }
                  }).catch((error) => {
                    console.log(error);
                  });    
             
            }
          })
    }
  render() {     
    return (
      <div>
          <div>
            <Navi user={document.cookie.replace(/(?:(?:^|.*;\s*)name\s*=\s*([^;]*).*$)|^.*$/, "$1")}/>
            <div className="centered">
            <span>This is the data we hold about you</span>
            <div className="userData">
                <span>Your username: <span>{this.state.userData.username}</span></span>
                <span style={{display: 'block'}}>You are with us since:<span> {new Date(this.state.userData.registrationDate).toLocaleString()}</span></span>
                <span style={{display: 'block'}}>You have submitted: <span style={{fontWeight: 'bolder'}}> {this.state.ticketCount}</span> tickets</span>
                <span style={{display: 'block'}}>THESE ARE YOUR OPTIONS</span>
                <div className="buttonToolbar-AS">
                    <Button size="large" variant="warning" onClick={() => this.changePassword()} >CHANGE PASSWORD</Button>
                    <Button size="large" variant="danger" onClick={() => this.deleteAccount()}>DELETE THIS ACCOUNT</Button>
                </div>
            </div>
            </div>
          </div>
      </div>
    );
  }
}
export default withRouter(AccountSettings);