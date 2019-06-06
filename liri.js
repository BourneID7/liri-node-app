require("dotenv").config();
var axios = require("axios");
// var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

var nodeQuery = process.argv[2];
var nodeArgs = process.argv;
var artist = "";
var song = "";
var movie = "";

// loop through all node process.argv after 2 (the command of which query to run)
// determine which query was requested
// add + between each word for query url
for (var i = 3; i < nodeArgs.length; i++) {

    // determine artist for bandsintown api
    if (nodeQuery === "concert-this") {
        if (i > 3 && i < nodeArgs.length) {
            artist = artist + "+" + nodeArgs[i];
          }
          else {
            artist += nodeArgs[i];
          }
          console.log("artist is " + artist); //console testing
    } 
    // determine song title for spotify api
    else if (nodeQuery === "spotify-this-song") {
        if (i > 3 && i < nodeArgs.length) {
            song = song + "+" + nodeArgs[i];
          }
          else {
            song += nodeArgs[i];
          }
          console.log("song title is " + song); //console testing
    }
    // determine movie title for omdb api
    else if (nodeQuery === "movie-this") {
        if (i > 3 && i < nodeArgs.length) {
            movie = movie + "+" + nodeArgs[i];
          }
          else {
            movie += nodeArgs[i];
          }
          console.log("movie title is " + movie); //console testing

    }
}

// query urls for each type of request
var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
var songUrl = "";
var movieUrl =  "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(movieUrl);

axios.get(movieUrl).then(
  function(response) {
    console.log("movie details: " + response.data);
  }
);
