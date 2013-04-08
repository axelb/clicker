/**
 * Module to collect all mongo db specific stuff.
 * @type {*}
 */

var mongoose = require('mongoose'),
    connection = mongoose.createConnection(process.env.MONGOURI),
    log4js = require('log4js'),
    logger = log4js.getLogger('server');

exports.connection = connection;

exports.mongoose = mongoose;

exports.Schema = mongoose.Schema;

connection.on('error', function (error) {
    logger.error("Connection error: " + error);
});

connection.on('open', function () {
    logger.debug('Mongo is opened for your convenience!');
});

