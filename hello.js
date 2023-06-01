const express = require('express')
const querystring = require("querystring");
const {test, signIn, realTimeUsernames, realTimeStorage, registerDiscordUser, findRefreshToken, findToken, deleteIf
, registerSpotifyUser} = require("./firebase");
const {getUsername, wait} = require("./utils")
const {redirectToAuthCodeFlow, generateCodeChallenge, generateCodeVerifier, getAccessToken, fetchProfile} = require("./Spot")
const app = express()
const cors = require('cors')
const {json} = require("express");
require('dotenv').config();


app.use(cors())
app.use(json())
app.all('/test', (req, res) => {
    const authorizeUrl = `https://discord.com/api/oauth2/authorize`;
    const queryParams = querystring.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        redirect_uri:'https://testing-7c5bf.web.app',
        response_type: 'code',
        scope: 'identify email'
    })
    res.redirect(`${authorizeUrl}?${queryParams}`)
})


app.all('/test2', async (req, res) => {
    const code = req.query.code;
    console.log('code: ' + code)

    const tokenUrl = 'https://discord.com/api/oauth2/token';
    const tokenParams = querystring.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://testing-7c5bf.web.app'
    })
    res.setHeader('Access-Control-Allow-Origin', 'https://testing-7c5bf.web.app');
 /*   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');*/
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


        console.log(process.env.DISCORD_TOKEN)
    const response = await fetch(tokenUrl, {
        method: "POST",
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams
    })
    const data = await response.json()
    console.log(data)
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    let username2=null;

        try{
    const {username, id} = await getUsername(accessToken);
    username2 = username;

    await signIn();
    const foundId = await findToken(id);

    if(foundId) {
        await deleteIf(foundId);
    }
    await registerDiscordUser(accessToken, refreshToken, username, id)

        } catch(Error){
        console.log(Error)
    }
    console.log('username2: ' + username2)

    res.send({username2, accessToken, refreshToken})
})




app.all('/yo', async (req, res) => {

      try {
        const result = await signIn();
        const foundId = await findToken();
        await wait(4000)
        const deletedIf = await deleteIf(foundId)

        res.send('result: ' + result);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }
});


app.all('/refresh', async (req, res)=>{
    //todo: Make it so that this actually finds the discord id lmfao and it isn't just hardcoded in the url
    /*const discordId =req.query.discordId;*/
   /* const refreshToken = await findRefreshToken(discordId)*/
    const refreshToken = req.query.refreshToken;

    const tokenUrl = 'https://discord.com/api/oauth2/token';
    const tokenParams = querystring.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'refresh_token',
       refresh_token: refreshToken
    })

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    const response = await fetch(tokenUrl, {
        method: "POST",
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams
    })

    const data = await response.json()
    console.log(data)


})

app.all('/redirectToSpot', async (req, res)=>{
    await redirectToAuthCodeFlow(process.env.SPOTIFY_CLIENT_ID, res)


})

app.all('/getAccessAndRefresh', async (req, res)=>{
    const code = req.query.code;
   const {access_token, refresh_token} = await getAccessToken(process.env.SPOTIFY_CLIENT_ID, code);
   console.log(access_token, refresh_token)
    res.setHeader('Access-Control-Allow-Origin', 'https://testing-7c5bf.web.app');
   /* res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');*/
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const spotProfile = await fetchProfile(access_token)


    res.send({access_token, refresh_token, spotifyId: spotProfile.id});

})

app.post('/final', async(req, res)=>{
    //todo: if reverting back to local testing change res.setHeader!!!!!!! and also
    //the redirect_uris more importantly
    //when adding a new user add them to allowlist in spotify developer dashboard

    const {spotifyAccessToken, spotifyRefreshToken, spotifyId, discordAccessToken} = req.body;
    console.log({spotifyAccessToken, spotifyRefreshToken, spotifyId, discordAccessToken})
/*    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');*/
    res.setHeader('Access-Control-Allow-Origin', 'https://testing-7c5bf.web.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    const code = await registerSpotifyUser(spotifyAccessToken, spotifyRefreshToken, spotifyId, discordAccessToken);
    res.status(200).send('Success!')

})

app.all('/uhm', async(req, res)=>{
    console.log(process.env.TEST);

    res.send('yeeh')
})


app.listen(process.env.PORT || 3000, ()=>{
    console.log('listening on port 3000')
})




