/**
 * Mocha based test for result collector of heatmap questions.
 * @type {*}
 */
'use strict';

var assert = require('assert'),
    pointCollector = require('./pointCollector'),
    collector = new pointCollector.PointCollector(),
    testId1 = "50d88d8d46bb810200000002",
    log4js = require('log4js'),
    testAnswer = {x : 1, y : 2},
    logger = log4js.getLogger('server');


describe('Vote Collector Test', function () {
    logger.setLevel('OFF');
    it('respond correctly if vote is not open', function () {
        assert.notEqual(collector.saveAnswer(4711, testAnswer), 0);
    });
});

it('should store some answers correctly', function () {
    collector.openVote(testId1);
    collector.saveAnswer(testId1, testAnswer);
    collector.saveAnswer(testId1, testAnswer);
    logger.error(collector.getResultsAsJSON(testId1));
    assert.equal(collector.getResultsAsJSON(testId1), '{"answers":[{"x":1,"y":2},{"x":1,"y":2}]}');
});

