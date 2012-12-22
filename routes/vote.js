
/*
 * GET vote
 */

exports.show = function(req, res){
  res.render('vote', { id: req.params.id });
};