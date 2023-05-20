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
    res.send(`${authorizeUrl}?${queryParams}`);
    res.redirect(`${authorizeUrl}?${queryParams}`)
})
app.listen(process.env.PORT || 3000)
