const express = require('express');
const router = express.Router();
const db = require('../models');

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

        res.render('userNew', context);
    })
})