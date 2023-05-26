const express = require('express')
const querystring = require("querystring");
const {test} = require("./firebase");
const {getUsername} = require("./utils")
const app = express()
app.all('/test', (req, res) => {
    const authorizeUrl = `https://discord.com/api/oauth2/authorize`;
    const queryParams = querystring.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        redirect_uri:'http://localhost:5000/',
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
        redirect_uri: 'http://localhost:5000/'
    })

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
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
    const {username, id} = await getUsername(accessToken);

    res.send({accessToken, refreshToken})
})



app.all('/yo', async (req, res)=>{
const arr = await test();
res.send(arr)
})



app.listen(process.env.PORT || 3000)


