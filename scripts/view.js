// Variable to store authentication state of user
var isSignedIn = false;
var displayName = 'Sample User';
var uid = '';
var currentPosition = { lat: 30.3983, lng: 78.0751 };

var infowindow;

var config = {
    apiKey: "AIzaSyAgieNUXJNQhcidxvbiNtOvWr48URVkc4o",
    authDomain: "stepping-stone-ditu.firebaseapp.com",
    databaseURL: "https://stepping-stone-ditu.firebaseio.com",
    projectId: "stepping-stone-ditu",
    storageBucket: "stepping-stone-ditu.appspot.com",
    messagingSenderId: "868662192128"
};

firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

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
            initMap();
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

// Initialize and add the map
function initMap() {
    infowindow = new google.maps.InfoWindow();
    // The location of Uluru - Default Marker Position
    // var uluru = { lat: 30.3983, lng: 78.0751 };
    // The map, centered at Uluru
    getLocation();
}

function loadData(map) {
    if (isSignedIn) {
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: [],
            map: map,
            radius: 10
        });
        var storedItems = firebase.database().ref('users');
        storedItems.on('child_added', function (snapshot) {
            snapshot.forEach(element => {
                var point = new google.maps.LatLng(parseFloat(element.child("lat").val()),
                    parseFloat(element.child("lng").val()));
                heatmap.getData().push(point);
                setMarker(
                    point,
                    element.child("desc").val(), 
                    element.child("img").val(),
                    element.child("user").val(),
                    map);
                console.log('loaded map')
            });
        });
    }
}

// Draws a marker on the map based on parameter data
//Variables Meaning:  a - Item Name, b - Item Description, c - Latitude, d - Longitude
function setMarker(point, e, img, user, map) {
    // var point = { lat: parseFloat(c), lng: parseFloat(d) }
    var marker = new google.maps.Marker({ position: point, map: map, title: e, icon: './assets/block.png', zIndex: 999 });
    var content = "<div style='float:left'><img src='"+img+"'></div><div style='float:right; padding: 10px;'><b>"+user+"</b><br/><hr>"+e+"</div>"
    makeInfoWindowEvent(map, infowindow, content, marker);
}

function makeInfoWindowEvent(map, infowindow, contentString, marker) {
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });
  }


function getNearestRoad(lat, long) {
    fetch('https://roads.googleapis.com/v1/nearestRoads?points='+lat+','+long+'&key=AIzaSyAlAS-bx-M16bI-vm8RUDIE3z02MdhWEFQ')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log("result")
            console.log(JSON.stringify(myJson));
        });
}

// Geo Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
        renderMap();
    }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    currentPosition = { lat: latitude, lng: longitude };
    renderMap()
}

function renderMap(){
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 17, center: currentPosition, mapTypeId: 'terrain',
            disableDefaultUI: true,
            gestureHandling: 'cooperative', minZoom: 5,
            panControl: false, styles: [
                {
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#1d2c4d"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#8ec3b9"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#1a3646"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#4b6878"
                        }
                    ]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#64779e"
                        }
                    ]
                },
                {
                    "featureType": "administrative.neighborhood",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#4b6878"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#334e87"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#023e58"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#283d6a"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#6f9ba5"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#1d2c4d"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#023e58"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#3C7680"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#304a7d"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#98a5be"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#1d2c4d"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#2c6675"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#255763"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#b0d5ce"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#023e58"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#98a5be"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#1d2c4d"
                        }
                    ]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#283d6a"
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#3a4762"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#0e1626"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#4e6d70"
                        }
                    ]
                }
            ]
        });
    map.setTilt(45)
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({
        position: currentPosition,
        map: map, title: "DIT UNIVERSITY Reported by Smart Phone",
        icon: './assets/human-marker1.png'
    });

    loadData(map); //Load saved Markers from database
}

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful./
    }).catch(function (error) {
        // An error happened.
    });
}

window.addEventListener('load', function () {
    initApp();
});
