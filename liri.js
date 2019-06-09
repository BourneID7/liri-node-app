require("dotenv").config();
var axios = require("axios");
var moment = require("moment")
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);

var nodeQuery = process.argv[2];
var nodeArgs = process.argv
var artist = "";
var song = "";
var movie = "";

// loop through all node process.argv after 2 (the command of which query to run)
// add required join character between each word for query url
for (var i = 3; i < nodeArgs.length; i++) {

    // determine artist for bandsintown api
    if (nodeQuery == "concert-this") {
        if (i > 3 && i < nodeArgs.length) {
            artist = artist + "%20" + nodeArgs[i];
          }
          else {
            artist += nodeArgs[i];
          }
        // query url for bandsintown api  
        var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        axios.get(bandsUrl).then(
          function(response) {
            for (i = 0; i < response.data.length; i++) {
              console.log("See " + artist + " at " + response.data[i].venue.name);
              if (response.data[i].venue.region != "") {
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
              } else {
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
              }
              console.log("Date: " + moment(response.data[i].datetime).format('MM/DD/YYYY'));
            }
          }
        ).catch(error => {
          console.log(error)
        }) 
    } 
    // determine song title for spotify api
    else if (nodeQuery == "spotify-this-song") {
        if (i > 3 && i < nodeArgs.length) {
            song = song + "%20" + nodeArgs[i];
          }
          else {
            song += nodeArgs[i];
          }
        spotify
          .request("https://api.spotify.com/v1/search?q=" + song + "&type=track")
          .then(function(data) {
            console.log(data);
            for (i = 0; i < data.tracks.items.length; i++) {
              console.log("Album title: " + data.tracks.items[i].album.name);
              console.log("Artist: " + data.tracks.items[i].album.artists.name);
              console.log("Song title: " + data.tracks.items[i].name);
            }
 
          })
          .catch(function(err) {
            console.error('Error occurred: ' + err); 
        }); 
    }
    // determine movie title for omdb api
    else if (nodeQuery == "movie-this") {
        if (i > 3 && i < nodeArgs.length) {
            movie = movie + "+" + nodeArgs[i];
          }
          else {
            movie += nodeArgs[i];
          }
        // query omdb api
        var movieUrl =  "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";
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
        )
    }
}


