/**
 * Module to collect all mongo db specific stuff.
 * @type {*}
 */

var mongoose = require('mongoose'),
    connection = mongoose.createConnection(process.env.MONGOURI);

exports.connection = connection;

exports.mongoose = mongoose;

exports.Schema = mongoose.Schema;

connection.on('error', function (error) {
    console.log("Connection error: " + error);
});

connection.on('open', function () {
    console.log('Mongo is opened for your convenience!');
});

