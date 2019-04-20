// Global Variables
var latitude, longitude;

// Variable to store authentication state of user
var isSignedIn = false;
var uid = '';
var displayName = '';

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
            displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            uid = user.uid;
            isSignedIn = true;
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

// Get a reference to the database service
var database = firebase.database();

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
        document.getElementById('locationInfo').value = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    // document.getElementById('latitude').innerText = position.coords.latitude
    // document.getElementById('longitude').innerText = position.coords.longitude;
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'cooperative', minZoom: 16,
        panControl: false,
        draggable: false,
        disableDefaultUI: true,
    });

    var myMarker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        draggable: true,
        map: map
    });

    google.maps.event.addListener(myMarker, 'dragend', function (evt) {
        latitude = evt.latLng.lat()
        longitude = evt.latLng.lng()
        console.log(evt.latLng.lat().toFixed(3) + ',' + evt.latLng.lng().toFixed(3))
    });

}

function uploadImage() {
    var canvas = document.getElementById("canvas");
    var img = canvas.toDataURL("image/png");
    var img
    fetch(img)
        .then(res => res.blob())
        .then(blob => {
            var formData = new FormData()
            formData.append('type', 'file')
            formData.append('image', blob)

            return fetch('https://api.imgur.com/3/upload.json', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Client-ID dc708f3823b7756'// imgur specific
                },
                body: formData
            })
                .then(function (res) { return res.json(); })
                .then(function (data) { return data['data']['link'] })
        })


}



// Save Item information to database
function saveDataToFirebase() {
    document.getElementById("save-btn").innerText = "Saving ..."
    document.getElementById("save-btn").disabled = true;
    if (isSignedIn) { //Check if user is signed-in
        // pushing items with unique key
        var desc = document.getElementById('description').value;
        displayName = displayName === null ? "Anonymous User" : displayName

        // Upload Image
        var canvas = document.getElementById("canvas");
        var img = canvas.toDataURL("image/png");
        var img
        fetch(img)
            .then(res => res.blob())
            .then(blob => {
                var formData = new FormData()
                formData.append('type', 'file')
                formData.append('image', blob)

                return fetch('https://api.imgur.com/3/upload.json', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Client-ID dc708f3823b7756'// imgur specific
                    },
                    body: formData
                })
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                        imgUrl = data['data']['link']
                        database.ref('users/' + uid + "/").push().set({
                            lat: latitude,
                            lng: longitude,
                            desc: desc,
                            img: imgUrl,
                            user: displayName
                        });
                        window.location.href = '/view.html'
                        initMap(); //refresh map with new markers added. 
                    })
            })
    }
    else {
        console.log('unable to save data to firebase!');
        document.getElementById("save-btn").innerText = "Save"
        document.getElementById("save-btn").disabled = false;
    }
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

// async function predictWithCocoModel()
// {
//   const model = await cocoSsd.load();
//   this.detectFrame(video,model);

// }


// detectFrame = (video, model) => {
//     model.detect(video).then(predictions => {
//     // this.renderPredictions(predictions);
//     predictions.forEach(element => {
//         console.log(element.class)
//     });
//     requestAnimationFrame(() => {
//     this.detectFrame(video, model);});
//     });
//   }