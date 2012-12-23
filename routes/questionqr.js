
/*
 * GET vote
 */

exports.show = function(req, res){
  res.render('questionqr', { id: req.params.id });
};