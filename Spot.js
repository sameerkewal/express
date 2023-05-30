const Spotify = require('spotify-api.js')
const crypto = require('crypto');




async function getNewSpotifyTokens(){

}


async function redirectToAuthCodeFlow(clientId, res) {
    const verifier = generateCodeVerifier(128);

    const challenge = await generateCodeChallenge(verifier);

  /*  localStorage.setItem("verifier", verifier);*/
    process.env.VERIFIER = verifier;

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://testing-7c5bf.web.app");
    params.append("scope",
        "user-read-private user-read-email user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative user-read-recently-played user-top-read playlist-modify-public playlist-modify-private"
    );
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`)
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log('verifier: ' + text)
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const hash = crypto.createHash('sha256')
    hash.update(codeVerifier);
    const digest = hash.digest();
    return digest.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function getAccessToken(clientId, code) {
  console.log(code)
    const verifier = process.env.VERIFIER;

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://testing-7c5bf.web.app");
    params.append("code_verifier", verifier);
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token, refresh_token } = await result.json();
    return {access_token, refresh_token};
}


async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    /*return*/
    return await result.json()

}

exports.redirectToAuthCodeFlow = redirectToAuthCodeFlow;
exports.getAccessToken=getAccessToken;
exports.generateCodeChallenge=generateCodeChallenge;
exports.generateCodeVerifier = generateCodeVerifier;
exports.fetchProfile = fetchProfile;
