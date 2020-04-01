import Swal from 'sweetalert2';
export function solveTicket(props) {
    let desc;
    Swal.fire({
        title: 'Solving Ticket',
        text: "Please provide explanation on how it was solved",
        input: 'text',
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!';
            }
            else
                desc = value;
        },
        showCancelButton: true,
        confirmButtonColor: '#32CD32',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Solve it!'
    }).then((result) => {
        if (!result.dismiss) {
            fetch('/api/support/SolveTicket', {
                method: 'POST',
                body: JSON.stringify({ ticketID: props, ticketDesc: desc }),
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
