import React, { Component } from 'react';
import './Dashboard.css';
import { List, Badge, Comment, Tooltip } from 'antd';
import { Button } from 'react-bootstrap';

const data = [
  {
      title: 'Ticket BA-DUM-TSH',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      dateCreated: '25/25/2525, 13:24'
  },
  {
    title: 'Ticket BA-DUM-TSH',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    dateCreated: '25/25/2525, 13:24'
    },
    {
        title: 'Ticket BA-DUM-TSH',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        dateCreated: '25/25/2525, 13:24'
    }
];
export default class Dashboard extends Component {
    render(){
      return (
        <div className="dashboard">
            <div className="split left">
                <div>
                    <h2 className="headerLeft">YOUR TICKETS</h2>
                    <div>
                    <List
                    header={<div className="tixHeader">Tickets created by you</div>}
                    bordered
                    dataSource={data}
                    renderItem={item => (
                        <List.Item className="item">
                            <div>
                                <h5>{item.title}</h5>
                                <p>{item.desc}</p>
                                <div className="toolbar">
                                    <div className="date">Date Created: {item.dateCreated}</div>
                                    <div className="status">Status: Solved</div>
                                    <div>Current Staff Member: Julia </div>
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
                        <h4>Ticket Title: TEST TICKET IS THIS IT?</h4>
                        <p className="ticketDesc"><span className="ticketDescHeader">Ticket Desc</span>: HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THIS HOW AWESOME IS THISHOW AWESOME IS THISHOW AWESOME IS THIS HOW AWESOME IS THIS</p>
                        <span className="curStaff">Staff Member assigned to it: <span className="currentStaffHeader">JULIA</span></span>
                        <span className="status">The status of the ticket is : <Badge count={'SOLVED'} style={{ backgroundColor: '#52c41a' }} /></span>
                        <div className="commentsContainer">
                            <h6 className="staff-comments">Comments by staff:</h6>
                            <Comment
                                author={<span>Han Solo</span>}
                                content={
                                <p>
                                    We supply a series of design principles, practical patterns and high quality design
                                    resources (Sketch and Axure), to help people create their product prototypes beautifully
                                    and efficiently.
                                </p>
                                }
                                datetime={
                                <Tooltip title={'date'}>
                                    <span>{'yes'}</span>
                                </Tooltip>
                                }
                            />
                        </div>
                        <div className="button-toolbar centered">
                            <Button>SUBMIT MORE INFORMATION(voluntary)</Button>
                            <Button variant="danger">CLOSE TICKET</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    }
}