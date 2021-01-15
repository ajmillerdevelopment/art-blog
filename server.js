const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const PORT = process.env.PORT || 4000

app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.listen(PORT, console.log(`Listening on ${PORT}`))