if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('../passport-config');
const { resolveInclude } = require('ejs');

initializePassport(
    passport,
    (param) => {
        console.log(param);
        return new Promise((res, rej) => {
           db.User.findOne({username: param}, (err, foundUser) => {
                if (err) rej(err);
                console.log(foundUser);
                // if (!foundUser) {
                //     console.log('no user found')
                // }
                // console.log(foundUser);
                res(foundUser)}); 
        })
    },
    (id) => {
        return new Promise((res, rej) => {
            db.User.find({_id: `${id}`}, (err, foundUser) => {
                if (err) rej(err);
                res(foundUser);
            }) 
        })
        
    }
)

router.use(flash());
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

function checkAuthent(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/users/login');
}

function checkNotAuthent(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}


// Adds route for user profile at id
router.get('/new', checkNotAuthent, (req, res) => {
    res.render('userNew');
});

router.get('/login', checkNotAuthent, (req, res) => {
    res.render('logIn');
})

router.delete('/logout', checkAuthent, (req, res) => {
    req.logOut();
    res.redirect('/users/login');
})
// Some of my code here was modeled off of the following website: https://www.youtube.com/watch?v=-RCnNyD0L-s

router.post('/new', checkNotAuthent, async (req, res) => {
    try {
        const newUser = {}
        const hashPass = await bcrypt.hash(req.body.password, 10);
        newUser.username = req.body.username;
        newUser.displayName = req.body.displayName;
        newUser.email = req.body.email;
        newUser.password = hashPass;
        db.User.create(newUser, (err, createdUser) => {
            if (err) {
                console.log(err);
                return res.send(err);
            };
            console.log(createdUser);
            res.redirect('login');
        })
    } catch {
        res.redirect('/new');
    };
});

router.put('/:id', (req, res) => {
    console.log(req.body.password);
    bcrypt.hash(req.body.password, 10).then((hash) => {
        console.log(hash);
       
        db.User.findByIdAndUpdate(
            req.params.id,
            {
                username: `${req.body.username}`,
                displayName: `${req.body.displayName}`,
                email: `${req.body.email}`,
                password: `${hash}`
            }, 
            (err, foundUser) => {
                console.log(foundUser);
                req.logOut();
                res.redirect('/users/login');
            })
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
}))



router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.User.findById(userId).populate('posts').exec((err, foundUser) => {
        if (err) throw err
        console.log('foundUser', foundUser)
        const context = {
            user: foundUser
        }
        res.render('userProfile.ejs', context)
    })
})


router.get('/:id/edit', checkAuthent, (req, res) => {
    db.User.findById(req.params.id, (err, foundUser) => {
        res.render('userUpdate.ejs', {user: foundUser})
    })
    console.log(req.isAuthenticated);
})




router.post('/:id/blog', (req, res) => {
    const authorID = req.params.id
    db.Post.create(req.body, (err, createdPost) => {
        if (err) throw err 
        console.log(createdPost)
        db.User.findByIdAndUpdate(authorID, {$push: {posts: createdPost._id}}, {new: true}, (err, updatedUser) => {if(err){console.log(err)}})
        db.Post.findByIdAndUpdate(createdPost._id, {author: authorID}, (err, foundAuthor) => {
            if (err) throw err
            res.redirect(`/users/${authorID}`)
        })
    })
})


router.delete('/:id/', (req, res) => {
    db.User.findByIdAndDelete(req.params.id, (err, deletedUser) => {
        if (err) {
            console.log(err);
            return res.send(err);
        };
        res.redirect('/');
        console.log('Deleted user: ', deletedUser);
    })
})

module.exports = router;