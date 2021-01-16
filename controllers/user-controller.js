const express = require('express');
const router = express.Router();
const db = require('../models');

// Adds route for user profile at id
router.get('/new', (req, res) => {
    res.render('userNew');
});


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
})

router.put('/:id', (req, res) => {
    db.User.findByIdAndUpdate(req.params.id, req.body, () => res.redirect('/'))
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
        db.User.findByIdAndUpdate(authorID, {$push: {posts: createdPost._id}}, (err, updatedUser) => {
            if (err) throw err;
            console.log(updatedUser)

        })
    })
})

module.exports = router;