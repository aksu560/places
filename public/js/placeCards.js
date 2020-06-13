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
    const placeCard = template.cloneNode(true).content;
    const titleElement = placeCard.querySelector('.card-title');
    const descElement = placeCard.querySelector('.card-desc');
    const hoursElement = placeCard.querySelector('.place-hours');


    placeCard.querySelector('.place-card').id = id;
    titleElement.textContent = title;
    descElement.textContent = description;
    hoursElement.textContent = "Open today: " + hours;
    placeCardDiv.appendChild(placeCard);

};

// Filter the place cards based on title.
function cardFilter(filter) {
    for (card of placeCardDiv.children) {
        const element = card;
        const title = element.querySelector('.card-title').textContent.toLowerCase();

        if (title.includes(filter.toLowerCase())) {
            element.hidden = false;
        } else {
            element.hidden = true;
        }
    }
}