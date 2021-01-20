const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    name: String,
    url: {type: String, required: true},
    post: [{type: Schema.Types.ObjectId, ref: 'Post'}]
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image
