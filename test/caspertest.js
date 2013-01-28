var casper = require('casper').create();

casper.start('http://localhost:8888/question/50efeec016c6190200000003/', function() {
    // search for 'casperjs' from google form
    //this.fill('form[action="/search"]', { q: 'casperjs' }, true);
    this.click('.alternative');
    this.click('#sendButton');
    this.click('#sendButton');
    this.click('#sendButton');
    this.click('#sendButton');
});

casper.then(function() {
 this.capture('results.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
});

casper.run(function() {
   this.exit();
});