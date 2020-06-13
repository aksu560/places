// All map related functions

let map;
let placeMarkerMap = new Map();
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

	let hours = [];

    if (name === "") {
		window.alert("Please add a name to the place.");
        return false;
    }

    // We add every pair of hours together into the array.
    // This is not a great way of doing it, but it works
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
	placeMarkerMap.set(
		id,
		new google.maps.Marker({
			position: { lat: lat, lng: long },
			map: map,
			label: nextMarkerLabel.toString(),
		})
	);
    document.getElementById(id).querySelector(".place-label")
    .textContent = nextMarkerLabel.toString();
    // Change the button 
    nextMarkerLabel++;
};

function removePlaceMarker(id) {
	placeMarkerMap.get(id).setMap(null);
}

// Removes all markers from the map
function resetPlaceMarkers() {
	for (const key of placeMarkerMap.keys()) {
		removePlaceMarker(key);
		placeMarkerMap.delete(key);
	}
}

function centerOnPlaceMarker(cardButton) {
    
    const placeId = cardButton.parentNode.parentNode.id;
    
    map.panTo(placeMarkerMap.get(placeId).getPosition());
}