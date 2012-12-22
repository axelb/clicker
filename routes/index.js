
/*
 * GET home page.
 */

exports.index = function(req, res){
   res.render('vote', { id: req.params.id });
};