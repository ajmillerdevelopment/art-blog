const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/project2blog';
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
    Post: require('./Post')
};