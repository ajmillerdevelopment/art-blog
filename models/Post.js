const mongoose = require('mongoose');
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {type: String, required:true},
    body: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    crosspost: Boolean,
    images: [{type: Schema.Types.ObjectId, ref: 'Image'}],
}, {timestamps: true} );

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
