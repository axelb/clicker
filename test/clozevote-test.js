/**
 * Integration test; requires a running server.
 * Stores a question to server by POST request up-front and opens a vote for that afterwards.
 */
var question = {question: "@@", type: "Cloze"},
    textToInsertIntoFreeTextField = "int i=1",
    textToExpect = "int i = 1",
    insertedTextToExpect = "To be removed!>",
    response,
    i;

casper.login('XXX', 'xxx');

// Post the prepared question data
casper.thenOpen('http://localhost:8888/question', {
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
    this.test.assertTruthy(response.id, "Repsonse must have contained an id");
});

// Now open the questions's qrcode which also will start a poll.
casper.then(function () {
    casper.thenOpen("http://localhost:8888/#/voteqr/Cloze/" + response.id, function () {
        casper.waitForSelector('#qrcode');
    })
});

// Now we switch to the student's side and open the question, insert text and submit
casper.then(function () {
    casper.thenOpen("http://localhost:8888/question/" + response.id, function () {
        casper.waitForSelector('#code', function () {
            this.sendKeys('#text0', textToInsertIntoFreeTextField);
            this.test.assertExists('#sendButton', "Expect the sendButton here");
            this.click('#sendButton');
        });
    });
});

// now let's look if there is the correct response data available (teacher side)
casper.then(function () {
    casper.open('http://localhost:8888/#/result/Cloze/' + response.id, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    });
});
casper.then(function() {
    casper.waitForSelector('td.resultcell', function () {
        this.test.assertTextExists(textToExpect, 'Inserted Text must be shown correctly!');
        this.click('td.resultcell');
    });
});

casper.then(function() {
    casper.waitForSelector('#theCode', function () {
        this.test.assertTextExists(insertedTextToExpect, 'Dialog text must be shown correctly!');
    });
});

casper.then(function () {
    this.capture('clozequestion.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
});

// RUN THE TESTS
casper.run(function () {
    this.test.renderResults(true, 0, 'log-clozevote.xml');
    casper.test.done();
});


