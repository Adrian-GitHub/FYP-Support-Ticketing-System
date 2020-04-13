import { Icon, notification } from 'antd';
import React from 'react';
import getStatus from '../../Admin/ui/modals/showTicket/api/getStatus';

export async function getAvailableTickets() {
    const res =  await fetch('/api/support/GetAvailableTickets', {
        method: 'POST',
        // We are not sending anything as user is authed in the backend as well, so we will verify his authenticity there
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await res.json();
    if (data.status === 'not_authed') {
            notification.open({
                message: 'Error!',
                description: 'You must be logged in to access that data.',
                icon: <Icon type="warning" style={{ color: '#ff0000' }} />,
            });
            this.props.history.push("/Login");
    }
    else if (data.status === 'success') {
            //temp var
            let tempTickets = [];
            //for each element, push it onto our temp var and then update state with it
            data.tickets.forEach(element => {
                console.log(element);
                const date = new Date(element.creationDate).toLocaleString();
                const status = getStatus(element.status);
                const comments = element.comments ? element.comments : 'CURRENTLY NONE';
                const commentsAuthor = element.commentsAuthor ? element.commentsAuthor : '';
                tempTickets.push({
                    id: element._id,
                    title: element.title,
                    desc: element.desc,
                    createdBy: element.createdBy,
                    dateCreated: date,
                    status: status,
                    commentsAuthor: commentsAuthor,
                    comments: comments,
                    camundaID: element.camundaID
                });
            });
            return tempTickets;
        }
}
