const express = require('express')
const querystring = require("querystring");
const app = express()
app.all('/test', (req, res) => {
    const authorizeUrl = `https://discord.com/api/oauth2/authorize`;
    const queryParams = querystring.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        redirect_uri:'https://testing-7c5bf.firebaseapp.com/',
        response_type: 'code',
        scope: 'identify email'
    })
    res.redirect(`${authorizeUrl}?${queryParams}`)
})


app.all('/test2', async (req, res) => {
    const code = 'P9np9kQsRs69CvWbjG29j5xtr90eUX';
    const tokenUrl = 'https://discord.com/api/oauth2/token';
    const tokenParams = querystring.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_TOKEN,
        redirect_uri: 'https://testing-7c5bf.firebaseapp.com/'
    })

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams
    })
    const data = await response.json()
    const accessToken = data.access_token;

    res.send(accessToken)
})

app.listen(process.env.PORT || 3000)
