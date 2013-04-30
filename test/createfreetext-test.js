/**
 * Integration test; requires running server.
 */

var casper = require('casper').create({timeout: 20000}),
    utils = require('utils'),
    freetext = "> for(int i = 0; i <= 100; i++) {\n> \n> ##\n> \n> }";

casper.start('http://localhost:8888/', function () {
    this.click('#menuNew');
    this.click('#newCloze');
});

casper.then(function () {
    this.test.assertExists('#questionTitle', 'Expect the field to enter question title');
    this.sendKeys('#questionTitle', 'To be removed!');

    this.test.assertExists('#questionTitle', 'Expect text field for free text');

    this.sendKeys('#questionTitle', freetext);

    this.click('#saveQuestion');
});

casper.then(function() {
    this.capture('cloze.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
});

casper.run(function () {
    this.test.renderResults(true, 0, 'log-createfreetext.xml');
});

