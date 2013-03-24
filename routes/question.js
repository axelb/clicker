var mongoose = require('mongoose')
  , markDown = require("node-markdown").Markdown
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
            res.render('noquestion');
            return;
          }
          if(data.imageId && data.imageId !== null) {
            Img.findOne().where('_id').equals(data.imageId).exec(function(error, img) {
              res.render('question', {question: data, image: img, markDown: markDown});
            });
          }
          else {
              res.render('question', {question: data, md: md});
          }
        }
    );
};

exports.asjson = function(req, res) {
  Question.findOne()
    .where('_id').equals(req.params.id)
    .exec(function(error, data) {
          if(error) {
            console.log("ERROR: " + error);
              res.send(404, 'Requested question not found');
          }
          res.end(JSON.stringify(data));
        }
    );
};

/**
 * Save or update a question depending on whether it already carries an _id or not.
 * @param req request object
 * @param res response object
 * @param imageId id of a newly attached image -- or null if no (or no new in case of editing) image is attached.
 */
var saveQuestion = function(req, res, imageId) {
    var question = JSON.parse(req.body.question)
      , id = question._id
      , newQuestion;
    console.log("Saving question: " + question);
    if(imageId) {
       question.imageId = imageId;
    }
    else if(!question.imageId) {
      question.imageId = null;
    }
    console.log(question);
    newQuestion = new Question(question);
    if(question._id) {
        delete question._id;//I don't really understand why this works!
        newQuestion.update(question, function(error){
            if(error) {
                console.log("Error: " + error);
            } else {
                console.log("Updated question:  " + newQuestion);
            }
        });
    } else {
        newQuestion.save(function(){console.log("Stored new question:  " + newQuestion);});
    }
    res.json({id: newQuestion._id});
    res.end();
};

/**
 * Prepares a question for storage in db. If an image is part of the request it is stored upfront and attached.
 * @param req
 * @param res
 */
exports.save = function(req, res) {
  var image = new Img();
  if(req.files.uploadedImage) {
      image.img.data = fs.readFileSync(req.files.uploadedImage.path);
      image.img.contentType = 'image/png';
      image.save(function (err, image) {
        console.log('saved img to mongo, id= ' + image._id);
        saveQuestion(req, res, image._id);
      });
  } else {
        saveQuestion(req, res, null);
      }
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
          console.log("question removed: " + req.params.id);
          res.redirect('/#/list');
        }
    );
};