var question = '{"question":"@@", "type": "Cloze", "imageId":""}',
    response,
    selector,
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

// Check the id that is returned by the server.
casper.then(function () {
    response = JSON.parse(casper.getHTML("pre"));//dirty hack
    this.test.assertTruthy(response.id, "Response must contain the id");
    selector = '#a' + response.id + "a";//a was inserted so that id is terminated by a text character.
});

casper.thenOpen('http://localhost:8888/#/list', function() {
    casper.waitForSelector(selector, function then() {
        this.test.assertExists(selector);
        this.click(selector);
    });
});

casper.then(function() {
    this.waitForSelector("#deleteConfirmDialog");
    this.test.assertExists("#deleteConfirmDialog");
    this.test.assertExists("#deleteLink");
    this.click("#deleteLink");
    casper.waitForSelector("#listQuestions", function() {
        this.test.assertDoesntExist(selector);
    });
});

casper.then(function () {
    this.capture('delete.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
});

casper.run(function () {
    this.test.renderResults(true, 0, 'log-delete.xml');
    casper.test.done();
});

