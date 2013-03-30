var mongoose = require('mongoose')
    , fs = require('fs')
    , connection = mongoose.createConnection(process.env.MONGOURI)
    , Schema = mongoose.Schema
    , imageSchema = new Schema({
        img: { data: Buffer, contentType: String }
    })
    , Image = connection.model('images', imageSchema);

connection.on('error', function (error) {
    console.log("Connection error: " + error);
});
connection.on('open', function () {
    console.log("Mongo connection opened!");
});

console.error('mongo is open');

// see https://gist.github.com/2408370
exports.attachImage = function (req, res) {
    var image = new Image();
    image.img.data = fs.readFileSync(req.files.uploadedFile.path);
    image.img.contentType = 'image/png';
    image.save(function (err, image) {
        if (err) {
            throw err;
        }
        console.log('saved img to mongo, id= ' + image._id);
        res.redirect('/#/new');
    });
};

/**
 * Delivers an image to a requesting client (REST Url).
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
exports.getImage = function (req, res) {
    console.log(req.params.id);
    exports.findById(req.params.id, function (error, data) {
        if (error) {
            console.log("ERROR: " + error);
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
            console.log("ERROR finding image for deletion: " + error);
            return;
        }
        data.remove();
        console.log('Deleted image ' + id);
    });
};
