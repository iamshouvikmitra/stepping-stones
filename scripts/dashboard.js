var config = {
    apiKey: "AIzaSyAgieNUXJNQhcidxvbiNtOvWr48URVkc4o",
    authDomain: "stepping-stone-ditu.firebaseapp.com",
    databaseURL: "https://stepping-stone-ditu.firebaseio.com",
    projectId: "stepping-stone-ditu",
    storageBucket: "stepping-stone-ditu.appspot.com",
    messagingSenderId: "868662192128"
};
firebase.initializeApp(config);
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            //   user.getIdToken().then(function (accessToken) {
            //     document.getElementById('sign-in-status').textContent = 'Signed in';
            //     document.getElementById('sign-in').textContent = 'Sign out';
            //     document.getElementById('account-details').textContent = JSON.stringify({
            //       displayName: displayName,
            //       email: email,
            //       emailVerified: emailVerified,
            //       phoneNumber: phoneNumber,
            //       photoURL: photoURL,
            //       uid: uid,
            //       accessToken: accessToken,
            //       providerData: providerData
            //     }, null, '  ');
            //   });
        } else {
            // User is signed out.
            //   document.getElementById('sign-in-status').textContent = 'Signed out';
            //   document.getElementById('sign-in').textContent = 'Sign in';
            //   document.getElementById('account-details').textContent = 'null';
            window.location.href = 'index.html'
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp()
});




// Grab elements, create settings, etc.
var video = document.getElementById('video');
var front = false;
var mediaConfig = { video: { facingMode: (front ? "user" : "environment") } };

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}
else if (navigator.getUserMedia) { // Standard
    navigator.getUserMedia({ video: true }, function (stream) {
        video.src = stream;
        video.play();
    }, errBack);
} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia({ video: true }, function (stream) {
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, errBack);
} else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia({ video: true }, function (stream) {
        video.srcObject = stream;
        video.play();
    }, errBack);
}

// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

// Trigger photo take
document.getElementById("snap").addEventListener("click", function () {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block"
    document.getElementById("check").style.display = "inline";
    // video.style.display = "none";
});

// Geo Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById('locationInfo').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    document.getElementById('locationInfo').innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}




// Menu Stuff

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful./
    }).catch(function (error) {
        // An error happened.
    });
}


// ML Stuff
// function applyML()
// {

// var video = document.getElementById('video');
//   // Load the model.
//   cocoSsd.load().then(model => {
//     // detect objects in the image.
//     model.detect(video).then(predictions => {
//       console.log('Predictions: ', predictions);
//     });
//   });
// }

async function predictWithCocoModel()
{
  const model = await cocoSsd.load();
  this.detectFrame(video,model);
  
}


detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
    // this.renderPredictions(predictions);
    predictions.forEach(element => {
        console.log(element.class)
    });
    requestAnimationFrame(() => {
    this.detectFrame(video, model);});
    });
  }