import React, { Component } from 'react';
import './Dashboard.css';
import { List, Badge, Comment, notification, Icon } from 'antd';
import { Button } from 'react-bootstrap';
import getStatus from '../../Admin/ui/modals/showTicket/api/getStatus';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';

const data = [
  {
      title: 'LOADING YOUR TICKETS',
      desc: 'PLEASE BEAR WITH US',
      dateCreated: 'IT WON\'T TAKE LONG'
  },
];
class Dashboard extends Component {
    state = {};
    constructor(){
        super();
        this.state = ({
            tickets: data,
            currentItem: {title: '', desc: '', dateCreated: '', staff: '', status: ''}
        })
    }
    // When component is "loaded", fetch ticket data corresponding to this user
    componentDidMount(){
        fetch('/api/client/GetTickets', {
            method: 'POST',
            // We are not sending anything as user is authed in the backend as well, so we will verify his authenticity there
            headers: {
              "Content-Type": "application/json"
            }
          }).then((res) => res.json()).then((data) => {
             if(data.status === 'not_authed'){
                notification.open({
                    message: 'Error!',
                    description:
                      'You must be logged in to access that data.',
                    icon: <Icon type="warning" style={{ color: '#ff0000' }} />,
                  });
                  this.props.history.push("/Login");
             }
             else if(data.status === 'success'){
                //temp var
                let tempTickets = [];
                //for each element, push it onto our temp var and then update state with it
                data.tickets.forEach(element => {
                const date = new Date(element.creationDate).toLocaleString();
                const status = getStatus(element.status);
                let staff;
                if(element.currentSupportStaff === 'free'){ staff = 'NOT YET TAKEN'} else staff = element.currentSupportStaff;
                const comments = element.comments ? element.comments : 'CURRENTLY NONE';
                const commentsAuthor = element.commentsAuthor ? element.commentsAuthor : ''
                    tempTickets.push({
                        id: element._id,
                        title: element.title,
                        desc: element.desc,
                        dateCreated: date,
                        staff: staff,
                        status: status,
                        commentsAuthor: commentsAuthor,
                        comments: comments,
                        camundaID: element.camundaID
                    });
                    this.setState({tickets: tempTickets});
                });
             }
          }).catch((error) => {
            console.log(error);
          });
    }
    closeTicket(){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, close my ticket'
          }).then((result) => {
            if (result.value) {
                fetch('/api/client/CloseTicket', {
                    method: 'POST',
                    body: JSON.stringify({id: this.state.currentItem.id, camundaID: this.state.currentItem.camundaID}),
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }).then((res) => res.json()).then((data) => {
                     if(data.status === 'success'){
                         Swal.fire('Success!', 'Ticket Closed', 'success');
                         window.location.reload();
                     }
                  }).catch((error) => {
                    console.log(error);
                  });                
            }
          })        
    }
    submitMoreInformation(){
        Swal.fire({
            title: 'Submitting more information',
            text: "Please elaborate on your problem here.",
            icon: 'question',
            input: 'text',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!';
                }
            },
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Submit'
          }).then((result) => {
            if (result.value) {
                fetch('/api/client/SubmitMoreInformation', {
                    method: 'POST',
                    body: JSON.stringify({id: this.state.currentItem.id, message: result.value, camundaID: this.state.currentItem.camundaID}),
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }).then((res) => res.json()).then((data) => {
                     if(data.status === 'success'){
                         Swal.fire('Success!', 'Information submitted.', 'success');
                         window.location.reload();
                     }
                  }).catch((error) => {
                    console.log(error);
                  });                
            }
          })        
    }
    viewTicket(item){
        this.setState({currentItem: item})
    }
    render(){
        // USER CAN ONLY CANCEL TICKET FROM CERTAIN STATUS POINTS. THESE POINTS ARE
        // Stage 1 and Stage 10

        // 1. ENTRY POINT, 5. Check Ticket, in our case true or false
        // 1. Open Ticket 2. Open Ticket on Behalf 3. Allocation to Support 4. Self Allocate
        // 5. Check Ticket 6. Reallocate ticket 7. Solve Ticket 8. Reopen ticket 9. Suspend Ticket
        // 10. Add More Information, 11. Close Ticket, 12. Close Expired Ticket, 13. Cancel by Support
        // 14. Cancel by user 15. Cancel abandoned ticket
        let cancellation = false;
        let submitMore = false;
        if(this.state.currentItem.status === 'Ticket Opened' || this.state.currentItem.status === 'More info needed') cancellation = true;
        if(this.state.currentItem.status === 'More info needed') submitMore = true;
      return (
        <div className="dashboard">
            <div className="split left">
                <div>
                    <h2 className="headerLeft">YOUR TICKETS</h2>
                    <div>
                    <List
                    header={<div className="tixHeader">Tickets created by you</div>}
                    bordered
                    dataSource={this.state.tickets}
                    renderItem={item => (
                        <List.Item onClick={() => this.viewTicket(item)} className="item">
                            <div>
                                <h5>{item.title}</h5>
                                <p>{item.desc}</p>
                                <div className="toolbar">
                                    <div className="date">Date Created: {item.dateCreated}</div>
                                    <div className="status">Status: {item.status}</div>
                                    <div>Current Staff Member: {item.staff} </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                    />
                    </div>
                </div>
            </div>
            
            <div className="split right">
                <div>
                <h2 className="headerRight">TICKET DATA</h2>
                    <div className="headerInnerRight">
                        <h5>IF EMPTY, CLICK ON THE LEFT TO LOAD THE TICKET</h5>
                    </div>
                    <div className="ticketView">
                        <h4>Ticket Title: {this.state.currentItem.title}</h4>
                        <p className="ticketDesc"><span className="ticketDescHeader">Ticket Desc</span>: {this.state.currentItem.desc}</p>
                        <span className="curStaff">Staff Member assigned to it: <span className="currentStaffHeader">{this.state.currentItem.staff}</span></span>
                        <span className="status">The status of the ticket is : <Badge count={this.state.currentItem.status} style={{ backgroundColor: '#52c41a' }} /></span>
                        <div className="commentsContainer">
                            <h6 className="staff-comments">Comments by staff:</h6>
                            <Comment
                                author={<span>{this.state.currentItem.commentsAuthor}</span>}
                                content={
                                <p>
                                    {this.state.currentItem.comments}
                                </p>
                                }
                            />
                        </div>
                        <div className="button-toolbar centered">
                            {submitMore && <Button onClick={() => this.submitMoreInformation()}>SUBMIT MORE INFORMATION</Button> }
                            {cancellation && <Button variant="danger" onClick={() => this.closeTicket()}>CLOSE TICKET</Button> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    }
}
export default withRouter(Dashboard);