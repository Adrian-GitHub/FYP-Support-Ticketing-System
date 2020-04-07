import Swal from 'sweetalert2';
export function suspendTicket(props, camundaID) {
    Swal.fire({
        title: 'Suspending the ticket',
        showCancelButton: true,
        text: 'Are you sure?',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Suspend'
    }).then((result) => {
        if (!result.dismiss) {
            fetch('/api/support/SuspendTicket', {
                method: 'POST',
                body: JSON.stringify({ ticketID: props, camundaID: camundaID }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => res.json()).then((data) => {
                if (data.status === "success") {
                    Swal.fire('Success', 'Ticket Suspended.', 'success').then(window.location.reload());
                }
            }).catch((error) => { console.log(error); });
        }
    });
}
