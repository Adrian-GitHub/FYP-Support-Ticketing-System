import Swal from 'sweetalert2';
export default function claimTicket(id, title, creator, camunda) {
    Swal.fire({
        title: `<i>Claiming ticket: ${title}</i>`,
        html: `Are you sure that you want to claim ticket <strong>${title}</strong> which was created by <strong>${creator}</strong>?`,
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#ff0000',
        reverseButtons: true,
        confirmButtonColor: '#d32d32c',
        confirmButtonText: 'Claim it!'
      }).then((result) => {
        if (result.value) {
            fetch('/api/support/ClaimTicket', {
                method: 'POST',
                body: JSON.stringify({ticketID: id, camundaID: camunda}),
                headers: {
                  "Content-Type": "application/json"
                }
              }).then((res) => res.json()).then((data) => {
                  if(data.status === 'success'){
                      //done
                      Swal.fire({
                          title: 'Ticket claimed!',
                          icon: 'success',
                          text: 'You may now find this ticket in your \'MY TICKETS \' section.'
                      }).then((result) => {
                          window.location.reload();
                      });
                  }
                  else Swal.fire('Error', 'There was an error claiming the ticket. Please try again', 'error');
              }).catch((error) => {
                console.log(error);
              });
        }
      })
}
