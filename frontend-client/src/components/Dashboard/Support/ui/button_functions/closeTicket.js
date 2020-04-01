import Swal from 'sweetalert2';
export function closeTicket(props) {
    Swal.fire({
        title: 'Close ticket',
        text: "Are you sure, you want to close the ticket?",
        input: 'text',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ask'
    }).then((result) => {
        if (!result.dismiss) {
            fetch('/api/support/CloseTicket', {
                method: 'POST',
                body: JSON.stringify({ ticketID: props }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => res.json()).then((data) => {
                if (data.status === "success") {
                    window.location.reload();
                }
            }).catch((error) => { console.log(error); });
        }
    });
}
