/**
 * node module to handle user data: username + Passwords/salts
 * @type {*}
 */

var mongo = require('./mongo'),
    crypto = require('crypto'),
    randomstring = require('randomstring'),
    userSchema = new mongo.Schema({
        username: { type: String, required: true, trim: true },
        salt: {type: String, required: true, trim: true },
        passwordHash: {type: String, required: false, trim: true }
    }),
    User = mongo.connection.model('users', userSchema),
    activeUsers = {},//"HashMap" to store active users
    log4js = require('log4js'),
    logger = log4js.getLogger('server');

/**
 * Funcion to be used as verification callback to passport's local strategy.
 * @param username
 * @param password
 * @param done passport local strategy callbacker's calbacker
 */
exports.verifier = function(username, password, done) {
    User.findOne()
        .where('username').equals(username)
        .exec(function (error, user) {
             if(error) {
                 return done(error);
             }
             if (!user) {
                 return done(null, false);
             }
            if (!exports.verifyPassword(user, password)) {
                return done(null, false);
            }
            activeUsers[user._id] = user;
            return done(null, user);
        });
};

/**
 *
 * @param user User object as read from database.
 * @param password  Password as used in login attempt.
 */
exports.verifyPassword = function(user, password) {
    var hash = this.createHashValue(password, user.salt),
        loginSuccessful = (hash === user.passwordHash);
    logger.debug('Login ' + (loginSuccessful ? 'successful' : 'failed') + ' for username ' + user.username);
    return loginSuccessful;
};

exports.serializer = function(user, done) {
    done(null, user._id);
};

exports.deserializer = function(id, done) {
    if(activeUsers[id]) {
        done(null, activeUsers[id]);
    } else {
        done(new Error('User ' + id + ' not found'), undefined);
    }
};

exports.createHashValue = function(password, salt) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(password + salt);
    return md5sum.digest('hex');
};

/**
 *  Helper method to insert user(s)
 * @param username
 * @param password
 * @param callback  Callback fundtion that may be called after user is inserted.
 * I use this to stop node execution.
 */
exports.insertUser = function(username, password, callback) {
    var user = new User();
    user.username = username;
    user.salt = randomstring.generate();
    user.passwordHash = this.createHashValue(password, user.salt);
    user.save(function(error, user) {
         if(error) {
             logger.error('Error inserting user: ' + error);
         }  else {
              logger.debug('Created user ' + user.username + ' (id: ' + user._id + ')');
         }
         if(callback) {
             callback();
         }

    });
};

exports.loggedInCheck = function(request, response) {
    var status = {
        status: request.isAuthenticated()
    };
    if(request.isAuthenticated() === true) {
        status.username = request.user.username;
    }
    response.end(JSON.stringify(status));
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};
