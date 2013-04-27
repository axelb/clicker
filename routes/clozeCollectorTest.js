/**
 * Mocha based test.
 * @type {*}
 */
var assert = require('assert'),
    clozeCollector = require('./clozeCollector'),
    collector = new clozeCollector.ClozeCollector(),
    testId1 = "50d88d8d46bb810200000002",
    testId2 = "50dc700d3cf6c33ebf000002",
    answers1 = {text0: "Bla"},
    answers2 = {text0: "Blubber"},
    log4js = require('log4js'),
    logger = log4js.getLogger('server');

describe('Cloze Collector Test', function () {
    logger.setLevel('OFF');
    it('should count 2 answers correct', function () {
        collector.openVote(testId1);

        collector.saveAnswer(testId1, answers1);
        assert.equal(collector.getResultsAsJSON(testId1), JSON.stringify({
            answers: ["Bla"]
        }));
        collector.saveAnswer(testId1, answers2);
        assert.equal(collector.getResultsAsJSON(testId1), JSON.stringify({
            answers: ["Bla", "Blubber"]
        }));
    });
});
