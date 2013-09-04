/**
 * Node module.
 * Collector class for collecting answers to point-and-click questions.
 * @type {*}
 */
'use strict';

var log4js = require('log4js'),
    logger = log4js.getLogger('server');

/**
 * @constructor Creates a new ClozeCollector object.
 */
exports.PointCollector = function () {
    this.answers = {};
};

exports.PointCollector.prototype = {

    /**
     * Create a new voting infrastructure for a given question's id.
     * @param id mongo id of a question.
     */
    openVote: function(id) {
        logger.debug("opening point vote for: " + id);
        this.answers[id] = [];
        logger.debug(this.answers[id]);
    },

    /**
     * The returned coordinates of an answer are saved.
     * @param id
     * @param answers
     * @return {number} 0 on success, -1 or 1 otherwise (1: vote not open, -1: no complete answer)
     */
    saveAnswer: function(id, answer) {
        if(!this.answers[id] || this.answers[id] === undefined) {
            logger.error('Vote not open for id: ' + id);
            return 1;
        }
        if(!answer.x || !answer.y) {
            return -1;
        }
        this.answers[id].push(answer);
        logger.debug(this.answers[id]);
        return 0;
    },

    closeVote: function(id) {
        // TODO: not sure yet what to do here
    },

    getResultsAsJSON: function(id) {
        return JSON.stringify({answers: this.answers[id]});
    }

};
