// All map related functions

let map;
let placeMarkerArray = [];
let nextMarkerLabel = 1;

// We define this here, so we have access to it from multiple functions. We can use that to change the places position
// after the user has opened the form for creating a new place.
let clickedPos;
let clickedPosMarker;

const placeForm = document.querySelector('#placeForm');

// Create the map element and bind it to the appropriate div.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 60.169283, lng: 24.928148},
      zoom: 16,
      disableDoubleClickZoom: true,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false
    });

    map.addListener('dblclick', function(mapsMouseEvent) {

        // Check for and remove a pre-existing marker.
        if (clickedPosMarker) {
            clickedPosMarker.setMap(null);
        }

        clickedPos = {lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng()}
        clickedPosMarker = new google.maps.Marker({
            position: clickedPos,
             map: map,
             animation: google.maps.Animation.DROP,
            });
            openPlaceForm(mapsMouseEvent.latLng);
    });
}

function openPlaceForm() {
    console.log(clickedPos)
    placeForm.style.display = "block";
}

function closePlaceForm() {
    placeForm.style.display = "none";
}


function addPlace() {

    let name = placeForm.querySelector('#place-name').value;
    let desc = placeForm.querySelector('#place-description').value;

    let inputList = placeForm.querySelector('.place-form-hours-list')
    .getElementsByTagName('input');

    let hours = []

    if (name === "") {
        window.alert("Please add a name to the place.")
        return false;
    }

    // We add every pair of hours together into the array.
    for (let i = 0; i < inputList.length / 2; i++) {

        let day = inputList[i*2].value + "-" + inputList[i*2+1].value;

        hours.push(day);
    }

    closePlaceForm();
    setPlace(user.uid, name, desc, clickedPos.lat, clickedPos.lng, hours);
    clickedPosMarker.setMap(null);

    return;
}

// Add a marker to the map.
function addPlaceMarker(id, lat, long) {

    // Add the marker to the array.
    placeMarkerArray.push([
        id,
        new google.maps.Marker({
            position: {lat: lat, lng: long},
            map: map,
            label: nextMarkerLabel.toString(),
        })
    ]);
    document.getElementById(id).querySelector(".place-label")
    .textContent = nextMarkerLabel.toString();
    // Change the button 
    nextMarkerLabel++;
};

function removePlaceMarker(id) {

    new_array = []
 
    for (let i = 0; i < placeMarkerArray.length; i++) {
        if (placeMarkerArray[i][0] === id) {
            placeMarkerArray[i][1].setMap(null);
        }
    }
}

// Removes all markers from the map
function resetPlaceMarkers() {
    
    for (let i = 0; i < placeMarkerArray.length; i++) {
        removePlaceMarker(
            placeMarkerArray[i][0]
        )
    }
}

function centerOnPlaceMarker(cardButton) {
    
    let placeId = cardButton.parentNode.parentNode.id;
    let targetMarker;

    for (let i = 0; i < placeMarkerArray.length; i++) {
        if (placeMarkerArray[i][0] === placeId) {
            targetMarker = placeMarkerArray[i][1];
        }
    }

    map.panTo(targetMarker.getPosition());
}