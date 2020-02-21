import React from 'react';
import {List, Card} from 'antd';

export default class Stats extends React.Component {
    render() {
        const data = [
            {
                title: 'Total Tickets',
                data: this.props.ticketData.length
            },
            {
                title: 'Closed Tickets',
                data: '0X0'
            },
            {
                title: 'Client Count',
                data: '0X0'
            },
            {
                title: 'User(Admin+Staff+Clients) Count',
                data: '0X0'
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
