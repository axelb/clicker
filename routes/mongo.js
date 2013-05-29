/**
 * Module to collect all mongo db specific stuff.
 * @type {*}
 */

var mongoose = require('mongoose'),
    connection = mongoose.createConnection(process.env.MONGOURI),
    connectionHealth = true,//lets monitor the connection
    log4js = require('log4js'),
    logger = log4js.getLogger('server');

exports.connection = connection;

exports.mongoose = mongoose;

exports.Schema = mongoose.Schema;

exports.health = function() {
    return connectionHealth;
};

connection.on('error', function (error) {
        connectionHealth = false;
    logger.error("Connection error: " + error);
});

connection.on('open', function () {
    logger.debug('Mongo is opened for your convenience!');
});

