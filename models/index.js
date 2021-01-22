const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI || 'mongodb+srv://ajm9594:4w8HMrLdTe2x2Lk@sei1207-alex-tom-blog.0daqe.mongodb.net/blog?retryWrites=true&w=majority';
const configObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

mongoose.connect(connectionString, configObject);

mongoose.connection.on('connected', () => {
    console.log('connected to mongdob')
});

mongoose.connection.on('error', (err) => {
    console.log(err)
});

mongoose.connection.on('disconnected', () => {
    console.log('disconnected from mongodb')
})

module.exports = {
    User: require('./User'),
    Post: require('./Post'),
    Image: require('./Image')
};