const express = require('express');
const router = express.Router();
const db = require('../models');

// Adds route for user profile at id
router.get('/new', (req, res) => {
    res.render('userNew');
});


router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.User.findById(userId, (err, foundUser) => {
        if (err) {
            console.log(err);
            return res.send(err);
        };

        const context = {
            user: foundUser
        };

        res.render('userProfile.ejs', context);
    })
})



router.post('/', (req, res) => {
    const newUser = {}
    newUser.username = req.body.username;
    newUser.displayName = req.body.displayName;
    db.User.create(newUser, (err, createdUser) => {
        if (err) {
            console.log(err);
            return res.send(err);
        };

        console.log(createdUser);
        res.redirect('/');
    })
})

module.exports = router;