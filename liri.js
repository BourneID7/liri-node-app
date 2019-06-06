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
    } 
    // determine song title for spotify api
    else if (nodeQuery === "spotify-this-song") {
        if (i > 3 && i < nodeArgs.length) {
            song = song + "+" + nodeArgs[i];
          }
          else {
            song += nodeArgs[i];
          }
    }
    // determine movie title for omdb api
    else if (nodeQuery === "movie-this") {
        if (i > 3 && i < nodeArgs.length) {
            movie = movie + "+" + nodeArgs[i];
          }
          else {
            movie += nodeArgs[i];
          }

    }
}

// query urls for each type of request
var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
var songUrl = "";
var movieUrl =  "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";

// This line is just to help us debug against the actual URL.
// console.log(movieUrl);

axios.get(movieUrl).then(
  function(response) {
    console.log("Movie title: " + response.data.Title);
    console.log("Released: " + response.data.Year);
    console.log("imdb Rating: " + response.data.imdbRating);
    console.log("Rotten Tomatoes rating: " + response.data.tomatoRating);
    console.log("Country: " + response.data.Country);    
    console.log("Language: " + response.data.Language);
    console.log("Plot: " + response.data.Plot);
    console.log("Actors: " + response.data.Actors);
  }
);
