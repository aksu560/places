// DB Functions.

let db;

document.addEventListener('DOMContentLoaded', event => {

    db = firebase.firestore();

});

// Establish stream to the users collection of places.
function getPlaces(user_id) {
    const db_response = db.collection('users/' + user_id + '/places/');

    // On snapshot establishes a stream, which means we can listen to changes to the db in realtime.
    db_response.onSnapshot(placeCollection => {

        // We reset the marker label counter and the pkaceMarkerArray.
        nextMarkerLabel = 1;
        resetPlaceMarkers();
        placeCollection.forEach(placeDoc => {

            // We get current day so we can display the open hours for the day.
            const currentDay = new Date().getDay();
            const data = placeDoc.data();

            addCard(placeDoc.id,
                data.name,
                data.description,
                data.open[currentDay]);

            addPlaceMarker(
                placeDoc.id,
                data.location.latitude,
                data.location.longitude,
                );
        });
    });
};

// Save a place in DB.
function setPlace(user_id, name, desc, lat, long, open) {
    const target_collection = db.collection('users/' + user_id + '/places/');

    data = {
        name: name,
        description: desc,
        location: new firebase.firestore.GeoPoint(lat, long),
        open: open,
    }

    // We verify that all the data is correct
    if (validatePlaceData(data)) {

        target_collection.add(data);
        return;
    }
}

// Validate data for setPlace()
function validatePlaceData(data) {
    let errorPrefix = "Failed to push place to DB, data verification failed:";

    if (!typeof(data.name) === "string" ) {
        console.error(errorPrefix, "data.name is not a string");
        return false;
    }

    if (!typeof(data.description) === "string") {
        console.error(errorPrefix, "data.description is not a string");
        return false;
    }

    // This offsets any location values that would be 0, because for some reason the firestore implementation does not like zeros and returns undefined.
    if (data.location.latitude === 0 ) {
        data.location = new firebase.firestore.GeoPoint(0.000001, data.location.longitude);
    }

    if (data.location.longitude === 0 ) {
        data.location = new firebase.firestore.GeoPoint(data.location.latitude, 0.000001);
    }
    
    // We check if the array contains an entry for each weekday.
    if (!data.open.length === 7) {
        console.error(errorPrefix, "data.open is not length 7");
        return false;
    }

    for (day of data.open) {
        if (!typeof(day) === "string") {
            console.error(errorPrefix, "data.open contains a value that is not a string");
            return false;
        };
    };

    return true;
};

// Removes a place from DB.
function deletePlace(element) {
    card = element.parentNode.parentNode;
    place_id = card.id;
    db.collection('users/' + user.uid + '/places/').doc(place_id).delete();
    card.parentNode.removeChild(card);
    removePlaceMarker(place_id);
}