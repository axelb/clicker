var mongoose = require('mongoose')
  , connection = mongoose.createConnection("mongodb://dl5mfx:tyre2hush7pal@ds043997.mongolab.com:43997/onlineresponse")
  , Schema = mongoose.Schema
  , Alternative = new Schema({
        title: { type: String, required: true, trim: true }
      })
  , questionSchema = new Schema({
        question      : { type: String, required: true, trim: true },
        alternatives  : [Alternative]
      })
  , Question = connection.model('questions', questionSchema);

connection.on('error', function(error){console.log("Connection error: " + error);});

exports.show = function(req, res) {
  Question.findOne()
    .where('_id').equals(req.params.id)
    .exec(function(error, data) {
          if(error) {
            console.log("ERROR: " + error);
          }
          console.log(data);
          res.render('question', {question: data});
        }
    );
};

exports.attachImage = function(req, res) {
  console.log(req);
}

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
var newQuestion = new Question(req.body);
  console.log(req.body);
  newQuestion.save(function(){console.log(newQuestion);});
  res.end();
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