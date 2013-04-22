/**
 * Integration test; requires running server.
 */

var casper = require('casper').create({timeout: 20000}),
    utils = require('utils'),
    freetext = "> for(int i = 0; i <= 100; i++) {\n> \n> <input type='text'></input>\n> \n> }";

casper.start('http://localhost:8888/', function () {
    this.click('#menuNew');
    this.click('#newFreeText');
});

casper.then(function () {
    this.test.assertExists('#questionTitle', 'Expect the field to enter question title');
    this.sendKeys('#questionTitle', 'To be removed!');

    this.test.assertExists('#code', 'Expect text field for free text');

    this.sendKeys('#code', freetext);

    this.click('#saveQuestion');
});

casper.run(function () {
    this.test.renderResults(true, 0, 'log-createfreetext.xml');
});

