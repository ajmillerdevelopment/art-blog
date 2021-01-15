const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const PORT = process.env.PORT || 4000

const userController = require('./controllers/user-controller.js')
const blogController = require('./controllers/blog-controller.js')

app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'))

app.use('/users', userController);
app.get('/', (req, res)  => {res.render('home.ejs')})


app.set('view engine', 'ejs')
app.listen(PORT, console.log(`Listening on ${PORT}`))