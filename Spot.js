const Spotify = require('spotify-api.js')


async function getSpotifyTokens() {
    const client = new Spotify.Client({
        token: {clientID: process.env.SPOTIFY_CLIENT_ID, clientSecret: process.env.SPOTIFY_CLIENT_SECRET},
        onReady() {
            console.log(client.token)
        }
    })

}

async function getNewSpotifyTokens(){

}


exports.getSpotifyTokens = getSpotifyTokens;
