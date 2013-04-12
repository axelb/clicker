/**
 * Integration test; requires a running server.
 * Stores a question to server and opens a vote for that afterwards.
 */
var casper = require('casper').create({timeout: 20000})
    , utils = require('utils')
    , question = '{"question":"Q","alternatives":[{"title":"A1","$$hashKey":"00E"},{"title":"A2","$$hashKey":"00G"}],"imageId":""}'
    , response;

casper.start();

// Post the prepared question data
casper.open('http://localhost:8888/question', {
    method: 'post',
    data: {
        'question': question
    },
    headers: {
        'Accept': 'application/json'
    }
});

// Check the id that is returned by the server.
casper.then(function() {
    response = JSON.parse(casper.getHTML("pre"));//dirty hack
    this.test.assertTruthy(response.id, "Repsonse must have contained an id");
});

// Now open the questions's qrcode which also will start a poll.
casper.then(function () {
    casper.thenOpen("http://localhost:8888/voteqr/" + response.id, function () {
            casper.waitForSelector('#qrcode');
    })
});

casper.then(function() {
    this.capture('qrcode.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
});

// Now we switch to the student's side and open the question
casper.then(function() {
    casper.thenOpen("http://localhost:8888/question/" + response.id , function() {
            casper.waitForSelector('#alternative0', function() {
                this.capture('question.png', {
                    top: 0,
                    left: 0,
                    width: 1024,
                    height: 768
                });
            });
    });
});

// Click on 1st alternative and submit
casper.then(function() {
    this.click('#alternative0');
    this.test.assertExists('#sendButton', "Expect the sendButton here");
    this.click('#sendButton');
});

// "danke" schould be shown in return!
casper.then(function() {
    casper.waitForSelector('#danke', function(){
        this.capture('danke.png', {
            top: 0,
            left: 0,
            width: 1024,
            height: 768
        });
    });
});

// now let's look if there is the correct statistics available
casper.then(function(){
    casper.open('http://localhost:8888/results/' + response.id, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    });
});

casper.then(function() {
    var statistics;
    console.log(casper.getHTML());
    statistics = JSON.parse(casper.getHTML("pre"));
    this.test.assertTruthy(statistics[0][1].label, "Repsonse must have one element");
    this.test.assertEquals(statistics[0][1].label, 1, "First label must be 1");
});



// RUN THE TESTS
casper.run(function () {
    this.test.renderResults(true, 0, 'log-vote.xml');
});

