const mongoose = require('mongoose');
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {type: String, required:true},
    body: String,
    author: {type: Schema.Types.ObjectId, ref: 'Author'},
    crosspost: Boolean,
    images: Array
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
