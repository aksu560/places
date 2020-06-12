// DB Functions.

let app;
let db;

document.addEventListener('DOMContentLoaded', event => {

    app = firebase.app();
    db = firebase.firestore();
});

// Fetches the user document from DB.
function getUserDocument(user_id) {
    const db_response = db.collection('users').doc(user_id);

    db_response.get()
        .then(doc => {
            userDocument = doc.data();
    })
    
    if (!userDocument) {

        const data = {
            name: user.displayName
        }

        userDocument = db.collection('users').doc(user_id).set(data);
    } 

    db_response.onSnapshot(userDoc => {
        userDocument = userDoc.data()
    });

}

// Establish stream to the users collection of places.
function getPlaces(user_id) {
    const db_response = db.collection('users/' + user_id + '/places/');

    db_response.onSnapshot(placeCollection => {
        placeCollection.forEach(placeDoc => {

            const currentDay = new Date().getDay();
            const data = placeDoc.data();

            addCard(placeDoc.id, data.name, data.description, data.open[currentDay]);
            addPlaceMarker(placeDoc.id, data.location.latitude, data.location.longitude);
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
    
    if (!data.open.length === 7) {
        console.error(errorPrefix, "data.open is not length 7");
        return false;
    }

    for (let i = 0; i < data.open.length; i++) {
        if (!typeof(data.open[i]) === "string") {
            console.error(errorPrefix, "data.open contains a value that is not a string");
            return false;
        };
    };

    return true;
};

// Delete place.
function deletePlace(element) {
    card = element.parentNode.parentNode;
    place_id = card.id;
    db.collection('users/' + user.uid + '/places/').doc(place_id).delete();
    card.parentNode.removeChild(card);
    removePlaceMarker(place_id);
}

// Testing function, to be deleted eventually.
function testSetPlace() {
    setPlace(
        user.uid,
        "Some place",
        "Descriptive description of the place Described",
        1,
        1,
        [
            "00:00-23:59",
            "00:00-23:59",
            "00:00-23:59",
            "00:00-23:59",
            "00:00-23:59",
            "00:00-23:59",
            "00:00-23:59",
        ]
    );
}