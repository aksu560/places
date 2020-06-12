// If the action the user logging in, it belongs here.

let userToken;
let user;
let userDocument;

document.addEventListener('DOMContentLoaded', event => {

    // We check if the user is already logged in.
    // TODO: Fix this. It doesnt work.
    user = firebase.auth().currentUser;

    if (user) {
        userLoggedIn();
    }

});

// Handling Google Popup login.
function googleLogin() {

    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        userToken = result.credential.accessToken;
        user = result.user;
        userLoggedIn();    
        getUserDocument(user.uid);

    }).catch(function(error) {

        // Quick and Dirty Error handling.
        console.error(error);
      });
}

// All the post login actions.
function userLoggedIn() {

    // Remove the login modal.
    let googleLoginElement = document.getElementById('login-modal');
    googleLoginElement.parentNode.removeChild(googleLoginElement);

    // Unhide the sidebar
    let sideBarElement = document.getElementById('sidebar');
    sideBarElement.removeAttribute('hidden');

    // Add Users Profile Picture.
    let userPictureElement = document.getElementById('user-profile-picture');
    userPictureElement.src = user.photoURL;

    // Establish stream to the places collection.
    getPlaces(user.uid);
}

function logout() {
    firebase.auth().signOut().then(function() {

        window.location.reload();
        return false;

      }, function(error) {
        console.error("Sign Out Failed")
      });
}