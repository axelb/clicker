/**
 * Standalone helper module to create and insert users
 * To start, the environment variable MONGOURI must be set and the database must be running.
 */

var mongo = require('./routes/mongo'),
    user = require('./routes/user');

console.log(user.insertUser('XXX', 'xxx', process.exit));
