
/*
 * GET vote
 */

exports.show = function(req, res){
  res.render('voteqr', { id: req.params.id });
};