var page = require('webpage').create();

page.onConsoleMessage = function(msg) { console.log(msg); };

page.onLoadFinished = function() {
    var offsets = page.evaluate(function() {
        console.log('url:', location.href);
        var alternatives = $('.alternative');
        return [alternatives.first().offset(), alternatives.last().offset(), $('#sendButton').first().offset()];
       });
    console.log(offsets[0].top);
    console.log(offsets[0].left);
    console.log(offsets[1].top);
    console.log(offsets[1].left);
    console.log(offsets[2].top);
    console.log(offsets[2].left);
    page.sendEvent('doubleclick', offsets[0].left - 1, offsets[0].top - 1);
    page.sendEvent('click', offsets[0].left, offsets[0].top);
    page.sendEvent('click', offsets[0].left + 10, offsets[0].top + 1);
    page.sendEvent('click', offsets[0].left + 2, offsets[0].top + 2);
    page.sendEvent('click', offsets[0].left + 3, offsets[0].top + 3);
    page.sendEvent('click', offsets[0].left + 4, offsets[0].top + 4);
    page.sendEvent('click', offsets[0].left + 5, offsets[0].top + 5);

    page.sendEvent('click', offsets[2].left + 1, offsets[2].top + 1);
    page.sendEvent('click', offsets[2].left + 1, offsets[2].top + 1);
    page.sendEvent('click', offsets[2].left + 1, offsets[2].top + 1);
    page.sendEvent('click', offsets[2].left + 1, offsets[2].top + 1);
    page.sendEvent('click', offsets[2].left + 1, offsets[2].top + 1);
    page.sendEvent('click', offsets[2].left + 1, offsets[2].top + 1);
    page.sendEvent('click', offsets[2].left + 1, offsets[2].top + 1);
    page.sendEvent('click', offsets[1].left + 1, offsets[1].top + 1);
    page.sendEvent('click', offsets[2].left + 2, offsets[2].top + 2);
    page.sendEvent('click', offsets[2].left + 3, offsets[2].top + 3);
    page.render('or.png');
    console.log("DONE");
    phantom.exit(0);
};

//page.open('http://onlineresponse.org/question/50ee7d76c2f2fd8c24000009');
page.open('http://localhost:8888/question/50dc6a964b641630bf000002');
