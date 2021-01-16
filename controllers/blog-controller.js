const express = require('express');
const router = express.Router();
const db = require('../models');

// Handles user creating a new blog post, renders new blog page
router.get('/:userId/new', (req, res) => {
    const userId = req.params.userId;
    db.User.findById(userId, (err, foundUser) => {
        if (err) {
            return res.send(err);
        }
        console.log('Creating new post for:', foundUser.displayName)
        res.render('blog/newBlog', {user: foundUser});
    }); 


});


// Handles user editing a blog post, render new blog page
router.get('/:postId/edit', (req, res) => {
    const postId = req.params.postId;
    db.Post.findById(postId, (err, foundPost) => {
        if (err) {
            return res.send(err);
        };
        const context = {
            post: foundPost
        };
        res.render('blog/editBlog', context);
    })
})

router.put('/:postId', (req, res) => {
    const postId = req.params.postId;
    db.Post.findByIdAndUpdate(postId, {
        title: req.body.title,
        body: req.body.body,
        crosspost: req.body.crosspost
    }, (err, updatedPost) => {
        if (err) throw err;
        console.log(updatedPost);
        res.redirect(`/users/${updatedPost.author}`);
    })
})

router.delete('/:postId', (req, res) => {
    db.Post.findByIdAndDelete(req.params.postId, (err, deletedPost) => {
        if (err) throw err
        res.redirect(`/users/${deletedPost.author}`);
        console.log('Deleted post: ', deletedPost);
    })
})

router.get('/collab', (req, res) => {
    db.Post.find({}, (err, foundPosts) => {
        if (err) throw err;
        foundPosts.sort((a, b) => {a.updatedAt - b.updatedAt})
        console.log(foundPosts)
        const context = {
            posts: foundPosts
        };
        res.render('blog/collabBlog', context)
    })
})

module.exports = router;