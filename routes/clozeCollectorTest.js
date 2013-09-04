/**
 * Mocha based test for the collector for cloze-questions.
 * @type {*}
 */
'use strict';

var assert = require('assert'),
    clozeCollector = require('./clozeCollector'),
    collector = new clozeCollector.ClozeCollector(),
    testId1 = "50d88d8d46bb810200000002",
    testId2 = "50dc700d3cf6c33ebf000002",
    answers1 = {text0: "Bla"},
    answers2 = {text0: "Blubber"},
    answers3 = {text0: "int i=0", text1: "if(b){}"},
    answers4 = {text0: "Bar", text1: "Baz"},
    log4js = require('log4js'),
    logger = log4js.getLogger('server');

describe('Cloze Collector Test 1', function () {
    logger.setLevel('OFF');
    it('should store 2 answers correct', function () {
        collector.openVote(testId1);

        collector.saveAnswer(testId1, answers1);
        assert.equal(collector.getResultsAsJSON(testId1), JSON.stringify({
            answers: [[{"text0": "Bla"}]]
        }));
        collector.saveAnswer(testId1, answers2);
        assert.equal(collector.getResultsAsJSON(testId1), JSON.stringify({
            answers: [[{"text0": "Bla"}], [{"text0": "Blubber"}]]
        }));
    });
});

describe('Cloze Collector Test with code beautification', function () {
    logger.setLevel('OFF');
    it('should store and beautify 2 answers correct', function () {
        collector.openVote(testId2);

        collector.saveAnswer(testId2, answers3);
        assert.equal(collector.getResultsAsJSON(testId2), JSON.stringify({
            answers: [[{"text0": "int i = 0", "text1": "if (b) {}"}]]
        }));
        collector.saveAnswer(testId2, answers4);
        assert.equal(collector.getResultsAsJSON(testId2), JSON.stringify({
            answers: [[{"text0": "int i = 0", "text1": "if (b) {}"}], [{"text0": "Bar", "text1": "Baz"}]]
        }));
    });
});
