const express = require('express');
const router = express.Router();
const db = require('../models');


// Handles user creating a new blog post, renders new blog page
router.get('/:userId/new', (req, res) => {
    const userId = req.params.userId;
    console.log(req.session.currentUser._id)
    console.log(req.params.userId);
    if (req.session.currentUser._id == req.params.userId) {
        
        db.User.findById(userId, (err, foundUser) => {
            if (err) {
                return res.send(err);
            }
            console.log('Creating new post for:', foundUser.displayName)
            const context = {
                user: foundUser,
                currentUser: null
            };
            if (req.session.currentUser) {
                context.currentUser = req.session.currentUser;
            }
            res.render('blog/newBlog', context);
        }); 
    } else {
        res.redirect(`/users/${userId}`)
        console.log('User Authentication failed');
    }
});


// Handles user editing a blog post, render new blog page
router.get('/:postId/edit', (req, res) => {
    const postId = req.params.postId;
    db.Post.findById(postId, (err, foundPost) => {
        if (err) {
            return res.send(err);
        };
        console.log(foundPost.author);
        const context = {
            post: foundPost,
            currentUser: null
        };
        if (req.session.currentUser) {
            context.currentUser = req.session.currentUser;
        }
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
        for (let image of deletedPost.images) {
            db.Image.findByIdAndDelete(image._id, (err, deletedImage) => {
                console.log('Deleted image: ', deletedImage._id);
            })
        };
        res.redirect(`/users/${deletedPost.author}`);
    })
})

router.get('/gallery', (req, res) => {
    db.Image.find({}, (err, foundImages) => {
        if (err) throw err
        const context = {
            images: foundImages,
            currentUser: null
        }
        if (req.session.currentUser) {
            context.currentUser = req.session.currentUser;
        }
        res.render('blog/gallery', context)
    })   
})


router.get('/collab', (req, res) => {
    db.Post.find({crosspost: true}).populate('author', 'displayName').exec((err, foundPosts) => {
        if (err) throw err;
        foundPosts.sort((a, b) => {a.updatedAt - b.updatedAt})
        // console.log(foundPosts)
        
        const context = {
            posts: foundPosts,
            currentUser: null
        };
        if (req.session.currentUser) {
            context.currentUser = req.session.currentUser;
        };
        res.render('blog/collabBlog', context)
    })
})


router.get('/:postId', (req, res) => {
    const postId = req.params.postId;
    db.Post.findById(postId).populate('author').populate('images').exec((err, foundPost) => {
        if (err) throw err;
        console.log('found post: ', foundPost)
        console.log('found images on that post: ', foundPost.images)
        const context = {
            post: foundPost,
            currentUser: null
        };
        if (req.session.currentUser) {
            context.currentUser = req.session.currentUser;
        };
        res.render('blog/blogDisplay', context)
    })
})
module.exports = router;