import Swal from 'sweetalert2';
export function reallocateTicket(props) {
    Swal.fire({
        title: 'Reallocation of Ticket',
        text: "This can't be reverted. Are you sure?",
        showCancelButton: true,
        confirmButtonColor: '#32CD32',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Reallocate'
    }).then((result) => {
        if (!result.dismiss) {
            fetch('/api/support/ReallocateTicket', {
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
