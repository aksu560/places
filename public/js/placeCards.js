// All functions related to places.

const sidebar = document.getElementById('sidebar');
const template = document.getElementById('place-card-template');
const placeCardDiv = document.getElementById('card-div');

// Create a placecard on the sidebar.
function addCard(id, title, description, hours) {

    // We check for an existing card with id, and remove it.
    existingCard = document.getElementById(id);

    if (existingCard) {
        existingCard.parentNode.removeChild(existingCard);
    }

    // Clone the template.
    let placeCard = template.cloneNode(true).content;
    let titleElement = placeCard.querySelector('.card-title');
    let descElement = placeCard.querySelector('.card-desc');
    let hoursElement = placeCard.querySelector('.place-hours');


    placeCard.querySelector('.place-card').id = id;
    titleElement.textContent = title;
    descElement.textContent = description;
    hoursElement.textContent = "Open today: " + hours;
    placeCardDiv.appendChild(placeCard);

};

// Filter the place cards based on title.
function cardFilter(filter) {
    for (let i = 0; i < placeCardDiv.children.length; i++) {
        let element = placeCardDiv.children[i];
        let title = element.querySelector('.card-title').textContent.toLowerCase();

        if (title.includes(filter.toLowerCase())) {
            element.hidden = false;
        } else {
            element.hidden = true;
        }
    }
}