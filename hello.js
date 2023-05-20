const express = require('express')
const app = express()
app.all('/test', (req, res) => {
    console.log('heyyyyy')
    res.send(process.env.DISCORD_CLIENT_ID)
})
app.listen(process.env.PORT || 3000)
