//Variables
require("dotenv").config();
const fs = require("fs");
let keys = require("./keys.js");
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
const axios = require('axios');
let command = process.argv[2];
let params = process.argv.slice(3).join(" ");
let moment = require('moment');
const chalk = require('chalk');

//Functions
function concertThis(){
    let url = "https://rest.bandsintown.com/artists/" + params + "/events?app_id=trilogy";
    // console.log (url);
//https://rest.bandsintown.com/artists/EDEN?app_id=trilogy
    axios.get(url)
        .then(function(response) {
            console.log(params);
            fs.appendFileSync("log.txt", "\n \n" + "##Concert-This Results:" + "\n" + params, err =>{if (err) throw err;});
            for(i=0; i<10;i++){
            let venue = response.data[i].venue;
                console.log(chalk.red(i+1));
                console.log(chalk.blue("Venue: ") + venue.name);
                console.log(chalk.blue("Where: ") + venue.city + ", " + venue.region + " " + venue.country);
                console.log(chalk.blue("When: ") + moment(response.data[i].datetime).format("MM/DD/YYYY"));

                fs.appendFileSync("log.txt",
                    "\n \n" + (i+1) + "\n" +
                    "Venue: " + venue.name +"\n" +
                    "Where: " + venue.city + ", " + venue.region + " " + venue.country + "\n" +
                    "When: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n"
                    ,err =>{if (err) throw err;});
            }
            fs.appendFileSync("log.txt", "\n" + "##Results End", err =>{if (err) throw err;});
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}
function spotifyThis(){
    spotify
        .search({ type: 'track', query: params })
        .then(function(res) {
            console.log(params);

            console.log(chalk.red("Band Name: ") + res.tracks.items[0].artists[0].name);
            console.log(chalk.red("Track Name: ") + res.tracks.items[0].name);
            console.log(chalk.red("Preview Link: ") + res.tracks.items[0].preview_url);
            console.log(chalk.red("Album Name: ") + res.tracks.items[0].album.name);

            // Appends to the Log.txt file
            fs.appendFileSync("log.txt",
                "\n \n ##Spotify-This-Song Results: \n" + params + "\n" +
                "\nBand Name: " + res.tracks.items[0].artists[0].name +
                "\nTrack Name: " + res.tracks.items[0].name +
                "\nPreview Link: " + res.tracks.items[0].preview_url +
                "\nAlbum Name: " + res.tracks.items[0].album.name +
                "\n \n ##Spotify-This-Song Results End##", err =>{if (err) throw err;});
        })
        .catch(function(err) {
            console.log(err);
        });
}
function movieThis(){
    let url = "https://www.omdbapi.com/?apikey=trilogy&t=" + params;
    axios.get(url)
        .then(function(response) {
            // fs.writeFileSync("Results.json", JSON.stringify(response));
            console.log(" ");
            console.log(params);
            console.log(chalk.red("Title: ") + response.data.Title);
            console.log(chalk.red("Year: ") + (response.data.Released).split(" ")[2]);
            console.log(chalk.red("IMDB Rating: ") + response.data.imdbRating);
            console.log(chalk.red("Rotten Tomatoes Rating: ") + response.data.Ratings[1].Value);
            console.log(chalk.red("Country Produced: ") + response.data.Country);
            console.log(chalk.red("Language: ") + response.data.Language);
            console.log(chalk.red("Plot: ") + response.data.Plot);
            console.log(chalk.red("Actors: ") + response.data.Actors);
            // Appends to the Log.txt file
            fs.appendFileSync("log.txt",
                "\n \n ##Movie-This Results: \n" + params + "\n" +
                "\nTitle: " + response.data.Title +
                "\nYear: " + (response.data.Released).split(" ")[2] +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                "\nCountry Produced: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nPlot: " + response.data.Plot +
                "\nActors: " + response.data.Actors +
                "\n \n ##Movie-This Results End##", err =>{if (err) throw err;});
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}
function doWhatItSays(){
    command = fs.readFileSync("random.txt", "utf8").split(",")[0];
    params = fs.readFileSync("random.txt", "utf8").split(",").slice(1).join(" ");

    switch(command){
        case "concert-this":
            concertThis(params);
            break;
        case "spotify-this-song":
            spotifyThis(params);
            break;
        case "movie-this":
            movieThis(params);
            break;
    }
}
function help() {
    console.log(chalk.red("node liri.js ") + chalk.blue("concert-this ") + chalk.yellow("<parameters>"));
    console.log(chalk.red("node liri.js ") + chalk.blue("spotify-this-song ") + chalk.yellow("<parameters>"));
    console.log(chalk.red("node liri.js ") + chalk.blue("movie-this ") + chalk.yellow("<parameters>"));
    console.log(chalk.red("node liri.js ") + chalk.blue("do-what-it-says "));

}

//Switch Case
switch(command){
    case "concert-this":
        concertThis();
    break;
    case "spotify-this-song":
        spotifyThis();
    break;
    case "movie-this":
        movieThis();
    break;
    case "do-what-it-says":
        doWhatItSays();
    break;
    case "help":
        help();
        break;
}
