// Much of this code comes from a youtube tutorial I had seen detailing how to set up a login page with passport.
// A link to the video can be found here: https://www.youtube.com/watch?v=-RCnNyD0L-s
// A link containing the repository containing much of the source code can be found here: https://github.com/WebDevSimplified/Nodejs-Passport-Login
// While I certainly borrowed much of the same code for setup (require links, simple authenticator functions), I had to do a lot of custom formatting, as the video didn't cover storing login info using an external DB.


const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const db = require('./models');

function initialize(passport, findUserByUsername, findUserById) {
    const authenticateUser = async (username, password, done) => {
        console.log(username);
        findUserByUsername(username).then((foundUser) => {
            console.log(foundUser);
            try {
                bcrypt.compare(password, foundUser.password, (err, res) => {
                    if (err) throw err;
                    if (res) {
                        console.log('found user successfully')
                        return done(null, foundUser);
                    } else {
                        console.log('credentials didnt match')
                        return done(null, false, {message: 'User Credentials Did Not Match'})
                    }
            })}
            catch (err) {
                return done(err);
            }
        })
        };   
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    authenticateUser));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => {
        return done(null, findUserById(id));
    })
}

module.exports = initialize;