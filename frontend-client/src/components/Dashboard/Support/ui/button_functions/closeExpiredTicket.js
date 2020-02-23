import Swal from 'sweetalert2';
export function closeExpiredTicket(props) {
    Swal.fire({
        title: 'Closing expired ticket',
        text: "Are you sure you want to close expired ticket?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (!result.dismiss) {
            fetch('/api/support/CloseExpiredTicket', {
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
