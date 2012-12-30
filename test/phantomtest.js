var page = require('webpage').create();

page.onConsoleMessage = function(msg) { console.log(msg); };

page.onLoadFinished = function() {
	var offsets = page.evaluate(function() {
		return [$('.alternative').first().offset(), $('#sendButton').first().offset()];
       });
	console.log(offsets[0].left);
	page.sendEvent('click', offsets[0].left + 1, offsets[0].top + 1);
	console.log(offsets[0].left);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
	page.render('or.png');
	console.log(offsets[0].left);
   	phantom.exit(0);
};

page.open('http://onlineresponse.org/question/50d727ee06517afe90000002');
//page.open('http://localhost:8888/question/50d727ee06517afe90000002');
