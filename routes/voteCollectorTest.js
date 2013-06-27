/**
 * Mocha based test.
 * @type {*}
 */
var assert = require('assert'),
    voteCollector = require('./voteCollector'),
    collector = new voteCollector.VoteCollector(),
    testId1 = "50d88d8d46bb810200000002",
    testId2 = "50dc700d3cf6c33ebf000002",
    log4js = require('log4js'),
    logger = log4js.getLogger('server');


describe('Vote Collector Test', function () {
    logger.setLevel('OFF');
    it('should count 2 answers correctly', function () {
        collector.openVote(testId1);

        collector.saveAnswer(testId1, [3]);
        assert.equal(collector.getResultsAsJSON(testId1), JSON.stringify([
            [0, {"label": 1}],
            [0, {"label": 2}],
            [1, {"label": 3}]
        ]));
        collector.saveAnswer(testId1, [3]);
        assert.equal(collector.getResultsAsJSON(testId1), JSON.stringify([
            [0, {"label": 1}],
            [0, {"label": 2}],
            [2, {"label": 3}]
        ]));
    });

    it('should count some more answers correctly', function () {
        collector.openVote(testId2);
        collector.saveAnswer(testId2, [3]);
        collector.saveAnswer(testId2, [3]);
        collector.saveAnswer(testId2, [3]);
        collector.saveAnswer(testId2, [2]);
        collector.saveAnswer(testId2, [1]);
        collector.saveAnswer(testId2, [1, 3]);
        assert.equal(collector.getResultsAsJSON(testId2), JSON.stringify([
            [2, {"label": 1}],
            [1, {"label": 2}],
            [4, {"label": 3}]
        ]));


        collector.saveAnswer(testId1, [2]);
        assert.equal(collector.getResultsAsJSON(testId1), JSON.stringify([
            [0, {"label": 1}],
            [1, {"label": 2}],
            [2, {"label": 3}]
        ]));
    });
});