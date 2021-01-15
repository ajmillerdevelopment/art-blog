const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/:userId/new', (req, res) => {
    const userId = req.params.userId;
    db.User.findById(userId, (err, foundUser) => {
        if (err) {
            return res.send(err);
        }
        console.log('Creating new post for:', foundUser.displayName)
    }); 

    const context = {userId: userId};
    res.render('blog/newBlog', context);
})

module.exports = router;