/**
 * Integration test that creates an MC question and expects it in the list.
 * Requires a running server.
 */

casper.login('XXX', 'xxx');

casper.thenOpen('http://localhost:8888/', function () {
    this.test.assertTitle("Online Response System (Clicker)");
    this.test.assertExists('#menuNew', 'Expect the "new" menu');
    this.click('#menuNew');
    this.test.assertExists('#newMultipleChoice', 'Expect the "multiple choice" entry');
    this.click('#newMultipleChoice');
});

casper.then(function () {
    casper.waitForSelector('#questionTitle');
});

casper.then(function () {
    this.test.assertExists('#questionTitle', 'Expect the field to enter question title');
    this.sendKeys('#questionTitle', 'To be removed!');

    this.test.assertExists('#alternative0', 'Expect text field for first alternative');
    this.test.assertDoesntExist('#alternative1', 'Do not expect text field for second alternative');
    this.click('#buttonAddAlternative');
    this.test.assertDoesntExist('#alternative1', 'Still do not expect text field for second alternative');

    this.sendKeys('#alternative0', 'This is a rest from an integration test!');
    this.click('#buttonAddAlternative');
    this.test.assertExists('#alternative1', 'Now I expect text field for second alternative');

    this.sendKeys('#alternative1', 'This is a rest from an integration test!');
    this.click('#saveQuestion');
});

casper.then(function () {
    casper.waitForSelector('#row0');
});

casper.then(function () {
    this.capture('results.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
});

casper.run(function () {
    casper.test.done();
});

