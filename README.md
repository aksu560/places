# Aksu-places

Small webapp for storing places.

## General Info
The project runs on Firebase, and uses Firestore as the database solution. In the front its JavaScript and SCSS. Map is provided by the Google Maps JavaScript API.

### How to use the actual site:

* Best use experience on Chrome, due to its superior time picker.
* Double click on the map to add a place.
* Add a name, description and opening hours if applicable.
* Click "Create Place
* You can search through places via their name with the search bar.
* You can pan to the place by clicking the red icon on the top of the card, with the identifying number on it.
* You can delete a place with the delete button on the card.


### Items on the specs that have not been implemented:

* Place keywords. The current tags under the open hours are placeholders.
* Editing places.
* Filtering places to only display currently open places. I originally missed this in hte specs, and hence the opening hours are in string format. Implementing it is doable, but requires minor tweaking to the database structure.

### Features not on the specs, that I'd like to have implemented, but haven't yet:

* Mobile support. The site simply does not work on mobile properly, it just makes everything thinner and thinner.
* Some kind of a quickstart tour for first time users.
* Actual database security. This thing is extremely unsecure. The DB does not care who sends or reads and what they send or read. This should be fixed.
* Consistant time picker. Right now the app uses the browsers time picker. And while Chromes isn't bad, it isn't good either. And Firefoxes picker is painful to use.
* Login persistance. Currently the user has to log in every time they reload the site.
* Have customization for the user, like setting if the week starts on sunday, and darkmode.
* Geolocation, so we can tell the user where they actually are. Right now the map centers on autotalo on load, no matter what.


### Code Oddities, AKA: "Wait why does it do this?"

There are a few oddities in the codebase that i feel like should be cleared up.

* **Why is the Firestore API downgraded?**  
The reason we use v7.14.1 instead of v7.15.0 is due to a bug in 7.15.0 which prevented establishing connection to the Firestore DB. [You can find the github issue here](https://github.com/firebase/firebase-js-sdk/issues/3179), and despite it being marked closed, it has not yet been properly resolved.

* **Why does validatePlaceData() in db.js do some weird offset thing for values of 0?**  
For some reason Firestore DB returns undefined for all GeoPoints with either lat or lng value of 0. I have no idea why, as the GeoPoint object itself works just fine with 0 values, but Firestore clearly does not like it.  This is a fairly unintrusive workaround.

* **The Maps APi Key is just supposed to be in the index.html? That seems unsafe.**  
Yes, Google Maps JS API key is supposed to be embedded in the code. Maps documentation doesn't recommend this, but considering the serverless nature of the project, there is no real way around it as far as I know. I am not a fan of it either, but the fairly tight security rules for the key **SHOULD** make it safe.


## Development Guide
This project was made with Node.js version 12.18.0 and npm version 6.14.4.  
I have no idea how it will run on anything else.

### Quickstart
The quick steps to getting the project up and running

* Install the firebase cli to your machine globally with `npm install -g firebase-tools`.
* Clone this repo.
* Go to [your firebase console](https://console.firebase.google.com) and create a new project. Disable Google Analytics when it asks.
* In the console, enable cloud firestore. You can find this under the database option on the sidebar. Use test mode for developing, but you should write actual security rules if you plan to properly deploy.
* Enable Google authentication in the project. You can find this from the sidebar under "Authentication".
* Log-in to the firebase cli with `firebase login`.
* Run `npm run init` to initialize the project. The command will give you some options for firebase features. Choose "Hosting" and "Firestore". When prompted to pick a project, choose "Use an existing project" and choose the one you created earlier. You can use the default options for the rest of the setup.
* Go create a Maps api key for your project at [the GCP console.](https://console.cloud.google.com/google/maps-apis/start) Set up some appropriate security rules while you are there.
* Replace the Maps API key in public/index.html with yours.
* Run `npm run serve` to spin up a test server on your machine. You can connect to it via localhost:5000. You are now ready to start developing. Run `npm run sass` to set up node-sass watcher if you plan to edit scss.
* When you wish to deploy, run `npm run deploy`

### NPM Scripts Help

* **serve**: Boots up a test server.
* **sass**: Sets up node-sass watcher, for automatic scss compilation.
* **sass-once**: Compiles scss once. This is here mostly for other scripts to use, you'll probably want to use `npm run sass` instead.
* **init**: Initializes the project. Installs node modules and runs firebase init.
* **deploy**: Compiles scss and runs firebase deploy.

## Database Schema

### Users Collection

We have a single collection called users.

Under this collection we have one document for each user. The document name is the user id.

The document has a field for the users name. A single field was selected over individual fields for first and last names, to provide support for individuals with no last name.

The document also has 2 sub-collections, places and tags.

#### Places sub-collection

The places collection has one document for each place the user has saved. The document name is the place id.

The document contains following fields: name, description, location and open.

The fields name and description are both string fields, that the user can set straight up.

The location is a geolocation field, which is set by the app as the user creates a new place.

The open field is an array field that represents the opening hours of the place. The array should contain seven (7) items, one for each weekday, starting from sunday, and ending on saturday. Each item on the array is a string. This string can either be generated by the app, or the user can input any string they wish to it.

#### Tags sub-collection

The tags collection has one document for each keyword the user has created. This collection also includes the reserved tag name "Favorites".

The document contains a field called places. The places field is an array, containing references to the documents of each place it is associated with.
