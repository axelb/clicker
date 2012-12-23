var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Alternative = new Schema({
      title: { type: String, required: true, trim: true }
    });

var voteSchema = new Schema({
    question      : { type: String, required: true, trim: true }
  , alternatives  : [Alternative]
});

var connection = mongoose.createConnection("mongodb://dl5mfx:tyre2hush7pal@ds043997.mongolab.com:43997/onlineresponse");
connection.on('error', function(error){console.log("Connection error: " + error)});

exports.show = function(req, res){
  res.render('vote', { id: req.params.id });
};

exports.save = function(req, res) {
var Vote = connection.model('Vote', voteSchema)
  , newVote = new Vote(req.body);
  console.log(req.body);
  newVote.save(function(){console.log(newVote);});
  res.end();
}