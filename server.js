const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const PORT = process.env.PORT || 4000
const db = require('./models');
const session = require('express-session');
const bcrypt = require('bcrypt');

const userController = require('./controllers/user-controller.js')
const blogController = require('./controllers/blog-controller.js')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000000000
    }
}));

app.use('/users', userController);
app.use('/blog', blogController);
app.get('/', (req, res)  => {
    db.User.find({}, (err, foundUsers) => {
        db.Image.find({}, (err, foundImages) => {
            db.Post.findOne({crosspost: true}).populate('author', 'displayName').exec((err, foundPost) => {
              const context = {users: foundUsers, images: foundImages, post: foundPost}
              if (req.session.currentUser) {
                context.currentUser = currentUser;
            }
              res.render('home.ejs', context)
            })
        })
    })})
// Route for logging out

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    })
})

// Route for rendering login page

app.get('/login', (req, res) => {
    res.render('logIn');
})

// Route for handling contact page

app.get('/contact', (req, res) => {
    db.User.find({}, (err, foundUsers) => {
        if (err) throw err;
        const context = {
            users: foundUsers
        };
        if (req.session.currentUser) {
            context.currentUser = currentUser;
        }
        res.render('contact', context);
    })
}) 

// Route for handling login requests

app.post('/login', (req, res) => {
    db.User.findOne({username: {$eq: req.body.username}}, (err, foundUser) => {
        if (err) throw err;
        if (!foundUser) {
            console.log('no user with that username found');
        }
        bcrypt.compare(req.body.password, foundUser.password, (err, resolved) => {
            if (err) throw err;
            if (resolved) {
                console.log('found user with matching username and password');
                req.session.currentUser = foundUser;
                res.redirect(`/users/${foundUser._id}`);
            } else {
                console.log('credentials didnt match')
                res.redirect('/login');
            }
        })
    })
})

app.set('view engine', 'ejs')
app.listen(PORT, console.log(`Listening on ${PORT}`))


