import Swal from 'sweetalert2';

export default function Logout(props) {
  Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to logout?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, log me out!'
  }).then((result) => {
    if(!result.dismiss){
    fetch('/api/login/Logout', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res) => res.json()).then((data) => {
      if (data.status === "success") {
          props.history.push("/Login");
      }
    }).catch((error) => { console.log(error); });
    }
  });
}
