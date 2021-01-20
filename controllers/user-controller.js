const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('multer')

//for multer, sets storage directory and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage})

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

router.post('/:id/blog', upload.array('images'), (req, res) => {
    const authorID = req.params.id
    db.Post.create(req.body, (err, createdPost) => {
        if (err) throw err 
        console.log(createdPost)
        for (let file of req.files) {
            db.Image.create({name: file.originalname, url: '/images/' + file.filename, post: createdPost._id}, (err, createdImage) => {
                if (err) throw err
                console.log(createdImage)
                db.Post.findByIdAndUpdate(createdPost._id, {$push: {images: createdImage._id}}, {new: true}, (err, updatedpost) => {if (err) throw err})
                
            })
        }
        db.User.findByIdAndUpdate(authorID, {$push: {posts: createdPost._id}}, {new: true}, (err, updatedUser) => {if(err){console.log(err)}})
        db.Post.findByIdAndUpdate(createdPost._id, {author: authorID}, (err, foundAuthor) => {
            if (err) throw err
            res.redirect(`/users/${authorID}`)
        })
    })
})


router.delete('/:id', (req, res) => {
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