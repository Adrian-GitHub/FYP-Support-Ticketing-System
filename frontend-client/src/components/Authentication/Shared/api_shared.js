import Swal from 'sweetalert2';

export default async function loginUser(username, password) {
    const userData = { //construct athe object with provided data
        username: username,
        password: password,
    };
    //fetch request, sending user's data to our server
    return await fetch('/api/login/Login', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => res.json()).then((data) => {
        //if user is authenticated move the user to the dashboard screen
        if(data.status === "Authed_admin"){
            return "admin";
        } 
        else if(data.status === "Authed_client"){
            return "client";
        } 
        else if(data.status === "Authed_support"){
            return "support";
        } 
        else {
            Swal.fire({icon: 'error', title: 'Oops...', html: 'Your credentials aren\'t valid.<br> &#9785;<br> Please try again'});
            return false;
        }
    }).catch((error) => {console.log(error); })
};
