require('dotenv').config();


const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const flash = require('express-flash');

const multer = require('multer')

//for multer, sets storage directory and filename
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const { resolveInclude } = require('ejs');

router.use(flash());




// Route for displaying page to create new users
router.get('/new', (req, res) => {
    const context = {currentUser: null}
    res.render('userNew', context);
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
            res.redirect('/login');
        })
    });  
});


router.put('/:id', (req, res) => {
    console.log(req.body.password);
    bcrypt.hash(req.body.password, 15, (err, hashPass) => {
        console.log(hashPass);
       
        db.User.findByIdAndUpdate(
            req.params.id,
            {
                username: req.body.username,
                displayName: req.body.displayName,
                email: req.body.email,
                password: hashPass
            }, 
            (err, foundUser) => {
                console.log(foundUser);
                res.redirect('/');
            })
    })
})


router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.User.findById(userId).populate('posts').exec((err, foundUser) => {
        if (err) throw err
        // console.log('foundUser', foundUser)
        const context = {
            user: foundUser,
            currentUser: null
        }
        if (req.session.currentUser) {
            context.currentUser = req.session.currentUser;
            console.log(req.session.currentUser)
        }
        res.render('userProfile.ejs', context)
    })
})


router.get('/:id/edit', (req, res) => {
    if (!req.session.currentUser) {
        res.redirect('/login');
    } else {
        if (req.session.currentUser._id === req.params.id) {       
        db.User.findById(req.params.id, (err, foundUser) => {
            const context = {
                user: foundUser,
                currentUser: null
            };
            if (req.session.currentUser) {
                context.currentUser = req.session.currentUser;
            }
            res.render('userUpdate.ejs', context)
        })
    } else {
        res.redirect(`/users/${req.params.id}`);
    }
}})

router.post('/:id/blog', upload.array('images'), (req, res) => {
    console.log(req.body);
    console.log(process.env.AWS_ACCESS_KEY_ID)
    const authorID = req.params.id
    db.Post.create(req.body, (err, createdPost) => {
        if (err) throw err 
        console.log(createdPost)
        for (let file of req.files) {
            s3.upload({Bucket: process.env.S3_BUCKET_NAME, Key: file.originalname, Body: file.buffer, ACL: "public-read"}, (err, data) => {
                if (err) throw err;
                const location = data.Location
                console.log(`Uploaded to ${location}`)
                db.Image.create({name: file.originalname, url: location, post: createdPost._id}, (err, createdImage) => {
                    if (err) throw err
                    console.log(createdImage)
                    db.Post.findByIdAndUpdate(createdPost._id, {$push: {images: createdImage._id}}, {new: true}, (err, updatedpost) => {if (err) throw err})
            })
            })
            
        }
        db.User.findByIdAndUpdate(authorID, {$push: {posts: createdPost._id}}, {new: true}, (err, updatedUser) => {if(err){console.log(err)}})
        db.Post.findByIdAndUpdate(createdPost._id, {author: authorID}, (err, foundAuthor) => {
            if (err) throw err
            res.redirect(`/users/${authorID}`)
        })
    })
})


router.delete('/:id/', (req, res) => {
    db.User.findByIdAndDelete(req.params.id, (err, deletedUser) => {
        if (err) throw err;
        for (let post of deletedUser.posts) {
            db.Post.findByIdAndDelete(post._id, (err, deletedPost) => {
                for (let image of deletedPost.images) {
                    db.Image.findByIdAndDelete(image._id, (err, deletedImage) => {
                        console.log('Deleted image: ', deletedImage._id);
                    })
                };
            })
        }
        res.redirect('/');
        console.log('Deleted user: ', deletedUser);
    })
})

module.exports = router;