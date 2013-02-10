var mongoose = require('mongoose')
  , fs = require('fs')
  , connection = mongoose.createConnection(process.env.MONGOURI)
  , Schema = mongoose.Schema
  , imageSchema = new Schema({
        img: { data: Buffer, contentType: String }
      })
  , Image = connection.model('images', imageSchema);

connection.on('error', function(error){console.log("Connection error: " + error);});
connection.on('open', function () {console.log("Mongo connection opened!");});

console.error('mongo is open');

// see https://gist.github.com/2408370
exports.attachImage = function(req, res) {
    var image = new Image();
    image.img.data = fs.readFileSync(req.files.uploadedFile.path);
    image.img.contentType = 'image/png';
    image.save(function (err, image) {
       if (err) throw err;
       console.log('saved img to mongo, id= ' + image._id);
       res.redirect('/#/new');
    });
};

exports.getImage = function(req, res) {
	console.log(req.params.id);
    Image.findOne()
    .where('_id').equals(req.params.id)
    .exec(function(error, data) {
          if(error) {
            console.log("ERROR: " + error);
          }
          if(data && data.img) {
              res.contentType(data.img.contentType);
              res.send(data.img.data);
          }
        }
    );
};
