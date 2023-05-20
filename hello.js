const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log(process.env.DISCORD_CLIENT_ID)
    res.send('Man!')
})
app.listen(process.env.PORT || 3000)
