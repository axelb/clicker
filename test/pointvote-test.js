var response;

casper.login('XXX', 'xxx');

casper.thenOpen('http://localhost:8888/', function () {
    this.click('#menuNew');
    this.click('#newPoint');
});

casper.then(function () {
    this.test.assertExists('#questionTitle', 'Expect the field to enter question title');
    this.sendKeys('#questionTitle', 'Heatmap test question!');
    // reuse of documentation ...
    this.fill('form#pointForm', {'imageFileToAttach': '../resources/websequencediagrams.com/usageScenario.png'});
    this.click('#saveQuestion');
});

// Check the id that is returned by the server.
//casper.then(function () {
//    document.querySelector('a[name="q"]').setAttribute('value', term);
//    console.log(casper.getHTML());
//    response = JSON.parse(casper.getHTML("pre"));//dirty hack
//    this.test.assertTruthy(response.id, "Repsonse must have contained an id");
//});


casper.run(function () {
    this.test.renderResults(true, 0, 'log-createpoint.xml');
    casper.test.done();
});
