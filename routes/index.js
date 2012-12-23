exports.index = function(req, res){
   res.render('question', { id: req.params.id });
};