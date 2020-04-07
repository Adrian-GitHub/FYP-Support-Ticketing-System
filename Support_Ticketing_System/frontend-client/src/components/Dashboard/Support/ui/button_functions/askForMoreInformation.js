import Swal from 'sweetalert2';
export function askForMoreInformation(props, camundaID) {
    let desc;
    Swal.fire({
        title: 'Asking for more information',
        text: "Please fill in the field clarifiying your reason",
        input: 'text',
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!';
            }
            else
                desc = value;
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ask'
    }).then((result) => {
        if (!result.dismiss) {
            fetch('/api/support/AskForMoreInformation', {
                method: 'POST',
                body: JSON.stringify({ ticketID: props, ticketDesc: desc, camundaID: camundaID }),
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
