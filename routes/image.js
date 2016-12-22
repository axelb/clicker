'use strict';

var mongo = require('./mongo'),
    fs = require('fs'),
    imageSchema = new mongo.Schema({
        img: { data: Buffer, contentType: String }
    }),
    Image = mongo.connection.model('images', imageSchema),
    log4js = require('log4js'),
    logger = log4js.getLogger('server');

/**
 * Save an image and call an asynch callback method with the created id.
 * @param imageData Image data, base64 encoded
 * @param callback Method to call asynchronously.
 */
exports.attachImage = function (imageData, callback) {
    var image = new Image();
    image.img.data = imageData;
    image.img.contentType = 'image/png';
    image.save(function (error, image) {
        if (error) {
            logger.error('Error saving image: ' + error);
            throw err;
        }
        logger.debug('Saved img to mongo, id= ' + image._id);
        callback(image._id);
    });
};

/**
 * Delivers an image to a requesting client (REST Url).
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
exports.getImage = function (req, res) {
    logger.debug("Request for Image: " + req.params.id);
    exports.findById(req.params.id, function (error, data) {
        if (error) {
            logger.debug("ERROR: " + error);
            res.send(404, 'Requested image not found (' + error + ')');
            return;
        }
        if (data && data.img) {
            res.contentType(data.img.contentType);
            res.send(data.img.data);
        }
    });
};

/**
 * Helper method to find an image by its id.
 * Asynch; therefore a callbacker must be provided that gets 2 params: error and imageData
 * @param id Id of image to find.
 */
exports.findById = function (id, callback) {
    Image.findOne()
        .where('_id').equals(id)
        .exec(callback);
};

/**
 * Helper function to delete an image with given id.
 */
exports.deleteImage = function (id) {
    if (!id || id === "") {
        return;
    }
    exports.findById(id, function (error, data) {
        if (error) {
            logger.error("ERROR finding image for deletion: " + error);
            return;
        }
        if (data) {
            data.remove(function (error) {
                if(error) {
                    logger.error('Could not delete image ' + id + ' (' + error + ')');
                } else {
                    logger.debug('Deleted image ' + id);
                }
            });
        }
    });
};
