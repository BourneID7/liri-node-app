require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api")
const spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const search = process.argv.slice(3).join("+");
let artist = "";
let song = "";
let movie = "";
let bandsUrl = "";
let movieUrl = "";

// function to get query urls
const getUrl = () => {
  if (command == "concert-this") {
    artist = search;
    bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  } else if (command == "movie-this") {
    movie = search;
    if (search === "") {
        movie = "mr+nobody";
        console.log("Since you didn't select a movie we recommend Mr. Nobody. It's on NetFlix.");
    }
    movieUrl =  "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";
  } else if (command == "spotify-this-song") {
    song = search;
    if (search === "") {
      console.log("Since you didn't enter a song title you're stuck with Ace of Base. Sorry!")
      song = "ace%20of%20base%20the%20sign";
    }
  }
}
getUrl();

// function for concert-this using bandsintown api query
const concertThis = () => {
  axios.get(bandsUrl).then(
    (response) => {
      for (i = 0; i < response.data.length; i++) {
        console.log("See " + response.data[i].lineup + " at " + response.data[i].venue.name);
        if (response.data[i].venue.region != "") {
        console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
        } else {
        console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
        }
        console.log("Date: " + moment(response.data[i].datetime).format('MM/DD/YYYY') + "\n______________________________________\n\n");

        // append data to log.txt file
        fs.appendFile("log.txt", "See " + response.data[i].lineup + " at " + response.data[i].venue.name + "\nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.country + "\nDate: " + moment(response.data[i].datetime).format('MM/DD/YYYY') + "\n______________________________________\n\n", (err) => {
          if (err) throw err;
        });
      }
    }
  ).catch(error => {
      console.log(error)
  })
}

// function for spotify-this-song using spotify api query
const spotifyThis = () => {
  spotify
    .request("https://api.spotify.com/v1/search?q=" + song + "&type=track")
    .then((data) => {
      for (i = 0; i < data.tracks.items.length; i++) {
        console.log("Song title: " + data.tracks.items[i].name + "\nArtist: " + data.tracks.items[i].artists[0].name + "\nAlbum title: " + data.tracks.items[i].album.name + "\nPreview the song at: " + data.tracks.items[i].external_urls.spotify + "\n______________________________________\n\n");

        // append song info to log.txt file
        fs.appendFile("log.txt", "Song title: " + data.tracks.items[i].name + "\nArtist: " + data.tracks.items[i].artists[0].name + "\nAlbum title: " + data.tracks.items[i].album.name + "\nPreview the song at: " + data.tracks.items[i].external_urls.spotify + "\n______________________________________\n\n", (err) => {
          if (err) throw err;
        });
      }
    })
    .catch((err) => {
      console.error('Error occurred: ' + err); 
    }); 
}

// function for movie-this using omdb api query
const movieThis = () => {
    axios.get(movieUrl).then(
      function(response) {
        console.log("Movie title: " + response.data.Title + "\nReleased: " + response.data.Year + "\nimdb Rating: " + response.data.imdbRating + "\nRotten Tomatoes rating: " + response.data.tomatoRating + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n______________________________________\n\n")

        // append movie info to log.txt file
        fs.appendFile("log.txt", "Movie title: " + response.data.Title + "\nReleased: " + response.data.Year + "\nimdb Rating: " + response.data.imdbRating + "\nRotten Tomatoes rating: " + response.data.tomatoRating + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n______________________________________\n\n", (err) => {
          if (err) throw err;
        });
      }
    )
  }

// function for do-what-it-says
const doThis = () => {
  fs.readFile("random.txt", "utf-8", (error, data) => {
      if (error) {
        console.log(error);
      } else {
        const dataArr = data.split(",");
        console.log(dataArr);
        command = dataArr[0];
        song = dataArr[1];
        spotifyThis();        
      }
  });
}

// determine which command to run
if (command == "concert-this") {
    concertThis();
} else if (command == "spotify-this-song") {
    spotifyThis();
} else if (command == "movie-this") {
    movieThis();
} else if (command == "do-what-it-says") {
    doThis();
} else {
  console.log("Sorry I didn't understand that command. Use one of these: concert-this, movie-this, spotify-this-song, do-what-it-says")
}