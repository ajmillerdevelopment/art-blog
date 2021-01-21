if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const flash = require('express-flash');



const { resolveInclude } = require('ejs');

router.use(flash());



// Route for displaying page to create new users
router.get('/new', (req, res) => {
    res.render('userNew');
});

// Route for posting new user data, makes new user with hashed password, 

router.post('/new', (req, res) => {
    bcrypt.hash(req.body.password, 15, (err, hashPass) => {
        const newUser = {
            username: req.body.username,
            displayName: req.body.displayName,
            email: req.body.email,
            password: hashPass,
        };
        db.User.create(newUser, (err, createdUser) => {
            if (err) {
                console.log(err);
                return res.send(err);
            };
            console.log(createdUser);
            res.redirect('login');
        })
    });  
});

// Route for rendering login page

router.get('/login', (req, res) => {
    res.render('logIn');
})

// Route for handling login requests

router.post('/login', (req, res) => {
    db.User.findOne({username: req.body.username}, (err, foundUser) => {
        if (err) throw err;
        console.log(req.body.password);
        console.log(foundUser.password);
        bcrypt.compare(req.body.password, foundUser.password, (err, resolved) => {
            console.log(req.body.password);
            console.log(foundUser.password);
            if (err) throw err;
            if (resolved) {
                console.log('found user with matching username and password');
                // Do stuff here
                res.redirect(`/users/${foundUser._id}`);
            } else {
                console.log('credentials didnt match')
                res.redirect('/login');
            }
        })
    })
})



// Route for logging out

// router.delete('/logout', (req, res) => {
//     res.redirect('/users/login');
// })




router.put('/:id', (req, res) => {
    console.log(req.body.password);
    bcrypt.hash(req.body.password, 15, (err, hashPass) => {
        console.log(hashPass);
       
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


router.get('/:id/edit', (req, res) => {
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