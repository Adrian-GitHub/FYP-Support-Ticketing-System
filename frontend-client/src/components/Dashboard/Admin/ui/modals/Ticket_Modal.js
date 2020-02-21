import Swal from 'sweetalert2';

// Send a POST request to API/BACKEND 
import createTicket from "./createTicket";

export default function showModal() {
    Swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3', '4', '5']
          }).queue([
            {
              title: 'Title of the ticket',
              text: 'The name, think about something unique'
            },
            'Created by',
            'Description',
            {
              title: 'Ticket status',
              text: 'Choose from the dropdown',
              input: 'select',
              inputOptions: [
                '1)Open Ticket', '2)Open Ticket On Behalf', '3)Allocation to Support',
                '4)Self Allocation', '5)Check Ticket', '6)Reallocate Ticket', '7)Solve Ticket',
                '8)Reopen Ticket', '9)Suspend Ticket', '10)Add more info', '11)Close Ticket',
                '12)Closed Expired Ticket', '13)Cancel by support', '14)Cancel by user', '15)Cancel abandoned ticket'
              ]
            },
            {
              title: 'Current Staff',
              text: 'If left blank then ticket can be claimed'
            },

          ]).then((result) => {
            if (result.value) {
              // We have the results, now send them to the createTicket function
              // Results are in array [0] -> [4], in order the way they have been entered
              // Results are stringified for simplicty purposes
              const answers = JSON.stringify(result.value)
              createTicket(answers).then((response) => {
                if(response) {
                  // Notify the user of our success
                  Swal.fire('Ticket created!', 'Ticket was successfully added into the database!', 'success').then(function() {
                    // Reload the page
                    window.location.reload();
                  });
                }
                else Swal.fire('Ticket wasn\'t created', ';( Please try again!', 'error');
              });
            }
          })
}