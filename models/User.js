const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post.js');

const userSchema = new Schema({
    username: {type: String, required: true},
    // password: {type: String, required: true},
    displayName: {type: String, required: true},
    posts: [{type: Schema.Types.ObjectId,
        ref: 'Posts'}],
    // isLoggedIn: {type: Boolean, default: false}
});

const User = mongoose.model('User', userSchema);

module.exports = User;