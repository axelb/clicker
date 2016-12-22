/**
 * Integration test to edit am MC question. In contrast to createmc-test the creation
 * is not done by a click through.
 */
'use strict';

// var casper = require('casper').create({
//     verbose: true,
//     logLevel: "debug"
// });

var question = '{"question": "MC-Question", "type": "MC", "imageId":"", "alternatives": [{"title": "alt1"}, {"title": "alt2"}]}',
    response,
    i;

casper.login('XXX', 'xxx');

// Post the prepared question data
casper.thenOpen('http://localhost:8888/question', {
    method: 'post',
    data: {
        'question': question
    },
    headers: {
        'Accept': 'application/json'
    }
});

casper.then(function () {
    this.capture('editmc.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
});
// Check the id that is returned by the server.
casper.then(function () {
    response = JSON.parse(casper.getHTML("pre"));//dirty hack
    this.test.assertTruthy(response.id, "Response must contain the id");
});

// Edit question (add an alternative, change text of another one) and save it.
casper.then(function () {
    casper.thenOpen("http://localhost:8888/#/edit/MC/" + response.id, function () {
        casper.waitForSelector('#buttonAddAlternative', function then() {
            this.test.assertExists('#alternative1', 'Second alternative must be there');
            this.test.assertDoesntExist('#alternative2', 'Do not expect text field for third alternative');
            this.click('#buttonAddAlternative');
            this.test.assertExists('#alternative2', 'Now text field for third alternative must exist');
            this.sendKeys('#alternative1', 'Edited Alternative 2');
            this.sendKeys('#alternative2', 'Added Alternative 3');
            this.click('#saveQuestion');
        });
    })
});

// wait for overview (list) to load.
casper.then(function() {
    casper.waitForSelector('#row0');
});

// now open that same question again
casper.then(function () {
    casper.thenOpen("http://localhost:8888/#/edit/MC/" + response.id, function () {
        casper.waitForSelector('#buttonAddAlternative', function then() {
            this.test.assertExists('#alternative0', 'First alternative must be there!');
            this.test.assertExists('#alternative1', 'Second alternative must be there!');
            this.test.assertExists('#alternative2', 'Third alternative must be there!');
        });
    })
});

casper.run(function () {
    this.test.renderResults(true, 0, 'log-edit.xml');
    casper.test.done();
});

