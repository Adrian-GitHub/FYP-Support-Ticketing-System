import Swal from 'sweetalert2';

export default async function registerUser(name, username, password) {
    const newUser = { //construct a new user with the provided data
        name: name,
        username: username,
        password: password,
    };
    //fetch request, sending user's data to our server
    return await fetch('/api/admin/Register', {
        method: 'POST',
        body: JSON.stringify(newUser), //use that data to send it along with the body which can be accessed by back-end
        headers: { // headers specify what payload is, its type.
            "Content-Type": "application/json"
        }
    }).then((res) => res.json()).then((data) => { // make response data accessible by dot notation
        //bad request means username is already taken
        if(data.username === "Username_taken"){
            //Configure the error message and update the state so that the pages refreshes
            Swal.fire('Username error','Someone already has this username.', 'error');
            return false;
        }
        else {
            return true;
        }
    }).catch((error) => {
        console.log(error);
    });    
}
