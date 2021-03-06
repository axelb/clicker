/**
 * Integration test; requires running server.
 */

var freetext = "> for(int i = 0; i <= 100; i++) {\n> \n> @@\n> \n> }";

casper.login('XXX', 'xxx');

casper.thenOpen('http://localhost:8888/', function () {
    casper.waitForSelector('#row0');
    casper.then(function() {
        this.click('#menuNew');
        this.click('#newCloze');
    });
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
    casper.test.done();
});

