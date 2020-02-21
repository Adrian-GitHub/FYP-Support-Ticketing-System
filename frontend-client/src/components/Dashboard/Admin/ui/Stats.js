import React from 'react';
import {List, Card} from 'antd';

export default class Stats extends React.Component {
    render() {
        let closedTickets = 0;
        this.props.ticketData.forEach(element => {
            // Last 4 out of 15, are close statuses
            if(element.status >= 11 || element.status === 7 || element.status === 9){
                closedTickets++;
            }
        });
        const data = [
            {
                title: 'Total Tickets',
                data: this.props.ticketData.length
            },
            {
                title: 'Closed Tickets',
                data: closedTickets
            },
            {
                title: 'Client Count',
                data: this.props.user
            },
            {
                title: 'Staff Count',
                data: this.props.staff
            }
        ];
        return (
            <div>
                <h3 style={{textAlign: 'center'}}>Statistics</h3>
            <List style={{width: '95vw', margin: '0 auto'}} grid={{gutter: 16, sm: 4,}} dataSource={data}
                renderItem={
                    item => (
                        <List.Item>
                            <Card title={
                                item.title
                            }>{item.data}</Card>
                        </List.Item>
                    )
                }/>
                </div>
        );
    }
}
