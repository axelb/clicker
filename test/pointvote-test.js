var heatmapQuestionUrl,
    baseUrl =  'http://localhost:8888/',
    heatmapSaveUrl = baseUrl + 'saveAnswer/point/',
    illegalVoteId = 4711,
    urlOfSomeAvailableImageFile = '../resources/websequencediagrams.com/usageScenario.png',
    createResultData = function(voteId) {
        return {
            vote: {
                id: voteId,
                results: {
                    x: "1",
                    y: "2"
                }
            }
        };
    };

casper.login('XXX', 'xxx');

casper.thenOpen(baseUrl, function () {
    this.click('#menuNew');
    this.click('#newPoint');
});

casper.then(function () {
    casper.waitForSelector('#questionTitle');
});

casper.then(function () {
    this.test.assertExists('#questionTitle', 'Expect the field to enter question title');
    this.sendKeys('#questionTitle', 'Heatmap test question!');
    // reuse of documentation ...
    this.fill('form#pointForm', {'imageFileToAttach': urlOfSomeAvailableImageFile});
    this.click('#saveQuestion');
});

// make sure that list is displayed!
casper.then(function () {
    casper.thenOpen('http://localhost:8888/#/list', function () {
        casper.then(function () {
            casper.waitForSelector('#row0');
        });
    });
});

// problem: Gives first not last heatmap!
casper.then(function(){
    var linkString = casper.getHTML(".qrCodeLink-Point");
    linkString = linkString.substring("<a href=\"/#/voteqr/Point/".length);
    qid = linkString.split("\"")[0];
    heatmapQuestionUrl = baseUrl + 'voteqr/Point/' + qid;
    this.thenOpen(heatmapQuestionUrl, function () {
        this.thenOpen(heatmapSaveUrl, {
            method: "post",
            headers: {
                'Content-type': 'application/json'
            },
            data: JSON.stringify(createResultData(qid))
        }, function() {
            this.test.assertTruthy(casper.getHTML().indexOf("Danke") > 0, "The word 'Danke' must be included in repsonse!");
        });
    });
});

//now test with non open / non existing question
casper.then(function() {
    this.thenOpen(heatmapSaveUrl, {
        method: "post",
        data: JSON.stringify(createResultData(illegalVoteId)),
        headers: { 'Content-type': 'application/json' },
    }, function() {
        this.test.assertTruthy(casper.getHTML().indexOf("kann derzeit keine Antwort entgegen genommen werden") > 0, "The words 'keine Antwort ....' must be included in repsonse!");
    });
});

casper.then(function () {
    this.capture('heatmap.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
});

casper.run(function () {
    casper.test.done();
});


