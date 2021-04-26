const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI 
const configObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};
console.log(process.env.MONGODB_URI)
console.log(connectionString)
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