import Swal from 'sweetalert2';

export function askForMoreInfo(ticket) {
  Swal.fire({
    title: 'Ask user for more information',
    text: 'Ticket will be put on hold until user responds!',
    icon: 'information',
    showCancelButton: true,
    confirmButtonText: 'Yes, let\'s go ahead!',
    cancelButtonText: 'No. I need to revise it.',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      fetch('/api/admin/AskForMoreInformation', {
        method: 'POST',
        body: JSON.stringify({ticketID: ticket}),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json()).then((data) => {
        if(data.status === 'success'){
           Swal.fire('Updated!', 'User needs to respond now.', 'success').then(function() {
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
