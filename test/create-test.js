var casper = require('casper').create()
  , utils = require('utils');;

casper.start('http://localhost:8888/', function() {
    //utils.dump(casper.cli.get('xunit'));
    this.test.assertTitle("Online Response System (Clicker)");
    this.test.assertExists('#buttonCreate', 'Expect a create button');
    this.test.assertExists('#buttonList', 'Expect the list button');
    this.click('#buttonCreate');
});

casper.then(function() {
     this.test.assertExists('#questionTitle', 'Expect the field to enter question title');
     this.sendKeys('#questionTitle', 'To be removed!');

     this.test.assertExists('#alternative0', 'Expect text field for first alternative');
     this.test.assertDoesntExist('#alternative1', 'Do not expect text field for second alternative');
     this.click('#buttonAddAlternative');
     this.test.assertDoesntExist('#alternative1', 'Still do not expect text field for second alternative');

     this.sendKeys('#alternative0', 'This is a rest from an integration test!');
     this.click('#buttonAddAlternative');
     this.test.assertExists('#alternative11', 'Now I expect text field for first alternative');

     this.sendKeys('#alternative1', 'This is a rest from an integration test!');
     this.click('#saveQuestion');
});

casper.then(function() {
    casper.thenOpen('http://localhost:8888/', function() {
        this.click('#buttonList');
    })
});

casper.then(function() {
    casper.waitForSelector('#row1');//TODO: add timeout

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
    this.test.renderResults(true, 0, 'log.xml');
//    this.test.done();
//    this.exit();
});

