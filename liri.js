require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var search = process.argv //process.argv.slice(3).join(" ")
var artist = "";
var song = "";
var movie = "";

// function for movie-this using omdb api query
function concertThis() {
    for (i = 3; i < search.length; i++) {
        if (i > 3 && i < search.length) {
            artist = artist + "%20" + search[i];
          }
          else {
            artist += search[i];
          }
    }
    var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandsUrl).then(
        function(response) {
        for (i = 0; i < response.data.length; i++) {
            console.log("See " + response.data[i].lineup + " at " + response.data[i].venue.name);
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

// function for spotify-this-song using spotify api query
function spotifyThis() {
    for (i = 3; i <= search.length; i++) {
        if (i > 3 && i < search.length) {
            song = song + "%20" + search[i];
          }
          else if (i > 3 && search.length == 4) {
            song += search[i];
          }
          else if (search.length == 3) {
            song = "ace%20of%20base%20the%20sign";
          }
    
    }
    spotify
      .request("https://api.spotify.com/v1/search?q=" + song + "&type=track")
      .then(function(data) {
        for (i = 0; i < data.tracks.items.length; i++) {
          console.log("Song title: " + data.tracks.items[i].name);
          console.log("Artist: " + data.tracks.items[i].artists[0].name);
          console.log("Album title: " + data.tracks.items[i].album.name);
          console.log("Preview the song at: " + data.tracks.items[i].external_urls.spotify);
        }

      })
      .catch(function(err) {
        console.error('Error occurred: ' + err); 
    }); 
}

// function for movie-this using omdb api query
function movieThis() {
    for (i = 3; i <= search.length; i++) {
        if (i > 3 && i < search.length) {
            movie = movie + "+" + search[i];
          }
          else if (i > 3 && search.length == 4) {
            movie += search[i];
          } 
          else if (search.length == 3) {
            movie = "mr+nobody";
            console.log("Since you didn't select a movie we recommend Mr. Nobody.");
          }
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

// function for do-what-it-says
function doThis() {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        if (error) {
          console.log(error);
        } else {
          var dataArr = data.split(",");
          console.log(dataArr)
        }
      });

}

if (command == "concert-this") {
    concertThis();
} else if (command == "spotify-this-song") {
    spotifyThis();
} else if (command == "movie-this") {
    movieThis();
} else if (command == "do-what-it-says") {
    doThis();
}