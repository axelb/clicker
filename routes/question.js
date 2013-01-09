var mongoose = require('mongoose')
  , fs = require('fs')
  , connection = mongoose.createConnection("mongodb://dl5mfx:tyre2hush7pal@ds043997.mongolab.com:43997/onlineresponse")
  , Schema = mongoose.Schema
  , Alternative = new Schema({
        title: { type: String, required: true, trim: true }
      })
  , questionSchema = new Schema({
        question      : { type: String, required: true, trim: true },
        alternatives  : [Alternative],
        imageId       : {type: String, required: false, trim: true}
      })
  , Question = connection.model('questions', questionSchema)
  , imageSchema = new Schema({
        img: { data: Buffer, contentType: String }
      })
  , Img = connection.model('images', imageSchema);

connection.on('error', function(error){console.log("Connection error: " + error);});

exports.show = function(req, res) {
  Question.findOne()
    .where('_id').equals(req.params.id)
    .exec(function(error, data) {
          if(error) {
            console.log("ERROR: " + error);
          }
          Img.findOne().where('_id').equals(data.imageId).exec(function(error, img) {
            res.render('question', {question: data, image: img});
          });
        }
    );
};

exports.asjson = function(req, res) {
  Question.findOne()
    .where('_id').equals(req.params.id)
    .exec(function(error, data) {
          if(error) {
            console.log("ERROR: " + error);
          }
          res.end(JSON.stringify(data));
        }
    );
};

exports.save = function(req, res) {
  var image = new Img();
  image.img.data = fs.readFileSync(req.files.uploadedImage.path);
  image.img.contentType = 'image/png';
  image.save(function (err, image) {
    var question = JSON.parse(req.body.question)
      , newQuestion;
    console.log('saved img to mongo, id= ' + image._id);
    question.imageId = image._id;
    console.log(question);
    newQuestion = new Question(question);
    //if (err) throw err;
    newQuestion.save(function(){console.log(newQuestion);});
    res.end();
  });
};

exports.list = function(req, res) {
	Question.find().exec(
		function(error, data) {
			res.end(JSON.stringify(data));
		});
};

exports.remove = function(req, res) {
  Question.findOne()
    .where('_id').equals(req.params.id)
    .exec(function(error, data) {
          if(error) {
            console.log("ERROR: " + error);
          }
          data.remove();
          res.redirect('/#/list');
        }
    );
};