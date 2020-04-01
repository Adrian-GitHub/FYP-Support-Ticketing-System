import Swal from 'sweetalert2';

export function deleteModal(ticket) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this! Ticket [ " + ticket.title + ' ] will be deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      fetch('/api/admin/DeleteTicket', {
        method: 'POST',
        body: JSON.stringify({ticketID: ticket.id}),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json()).then((data) => {
        if(data.status === 'success'){
           Swal.fire('Deleted!', 'This ticket has been deleted.', 'success').then(function() {
            // Reload the page
            window.location.reload();
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    }
    else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Ticket saved :)', 'error');
    }
  });
}
