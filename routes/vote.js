
/*
 * GET vote
 */

exports.show = function(req, res){
  res.render('vote', { id: req.params.id });
};

exports.save = function(req, res) {
	res.end("got:" + req.toString());
}