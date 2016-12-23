/**
 * Integration test to edit am MC question. In contrast to createmc-test the creation
 * is not done by a click through but by an up-front POST request.
 */
'use strict';

var question = {question: "MC-Question", type: "MC", alternatives: [{title: "alt1"}, {title: "alt2"}]},
    response,
    i;

casper.test.begin("Test for editing an MC question", 8, function (test) {

    casper.login('XXX', 'xxx');

    // Post the prepared question data
    casper.thenOpen('http://localhost:8888/question/', {
        method: 'post',
        data: JSON.stringify(question),
        headers: {
            'Accept': 'application/json;charset=UTF-8',
            'Content-type': 'application/json'
        }
    });

    // Check the id that is returned by the server.
    casper.then(function () {
        response = JSON.parse(casper.getHTML("pre"));//dirty hack
        test.assertTruthy(response.id, "Response must contain the id");
    });

    // Edit question (add an alternative, change text of another one) and save it.
    casper.then(function () {
        casper.thenOpen("http://localhost:8888/#/edit/MC/" + response.id, function () {
            casper.waitForSelector('#buttonAddAlternative', function then() {
                test.assertExists('#alternative0', 'First alternative must be there');
                test.assertExists('#alternative1', 'Second alternative must be there');
                test.assertDoesntExist('#alternative2', 'Do not expect text field for third alternative');
                this.click('#buttonAddAlternative');
                test.assertExists('#alternative2', 'Now text field for third alternative must exist');
                this.sendKeys('#alternative1', 'Edited Alternative 2');
                this.sendKeys('#alternative2', 'Added Alternative 3');
                this.click('#saveQuestion');
            });
        })
    });

    // wait for overview (list) to load.
    casper.then(function () {
        casper.waitForSelector('#row0');
    });

    // now open that same question again
    casper.then(function () {
        casper.thenOpen("http://localhost:8888/#/edit/MC/" + response.id, function () {
            casper.waitForSelector('#buttonAddAlternative', function then() {
                test.assertExists('#alternative0', 'First alternative must be there!');
                test.assertExists('#alternative1', 'Second alternative must be there!');
                test.assertExists('#alternative2', 'Third alternative must be there!');
            });
        })
    });

// casper.then(function () {
//     console.log('captureing');
//     this.capture('editmc.png', {
//         top: 0,
//         left: 0,
//         width: 1024,
//         height: 768
//     });
// });

    casper.run(function () {
        test.renderResults(true, 0, 'log-edit.xml');
        casper.test.done();
    });
});