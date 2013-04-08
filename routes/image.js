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
 * @param path Path to image on the local file system.
 * @param callback Method to call asynchronously.
 */
exports.attachImage = function (path, callback) {
    var image = new Image();
    image.img.data = fs.readFileSync(path);
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
    logger.debug(req.params.id);
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
    exports.findById(id, function (error, data) {
        if (error) {
            logger.error("ERROR finding image for deletion: " + error);
            return;
        }
        data.remove();
        logger.debug('Deleted image ' + id);
    });
};
