var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Alternative = new Schema({
        title: { type: String, required: true, trim: true }
      })
  , voteSchema = new Schema({
        question      : { type: String, required: true, trim: true },
        alternatives  : [Alternative]
      })
  , connection = mongoose.createConnection("mongodb://dl5mfx:tyre2hush7pal@ds043997.mongolab.com:43997/onlineresponse")
  , Vote = connection.model('Vote', voteSchema);

connection.on('error', function(error){console.log("Connection error: " + error)});

exports.show = function(req, res) {
  Vote.find()
    .where('_id').equals(req.params.id)
    .exec(function(error, data){
           res.render('vote', {vote: data[0]});
    });
};

exports.save = function(req, res) {
var newVote = new Vote(req.body);
  console.log(req.body);
  newVote.save(function(){console.log(newVote);});
  res.end();
}

exports.list = function(req, res) {
	Vote.find().exec(
		function(error, data) {
			res.end(JSON.stringify(data));
		});
}