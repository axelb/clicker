exports.result = function(req, res) {
  //var votes = 
  res.render('result', { id: req.params.id });
};