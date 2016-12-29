/**
 * Node module VoteCollector class.
 * A vote collector once opened collects incoming votes on SC and MC questions from student's (audience) devices (BYOD).
 * It simply counts up results in an array. A vote for a question must be opened explicitly and it will
 * be closed  when results are queried (NYI).
 */
'use strict';

var log4js = require('log4js'),
    logger = log4js.getLogger('server');

/**
 *
 * @constructor Creates a new VoteCollector object.
 */
exports.VoteCollector = function () {
    this.votes = {};
};

exports.VoteCollector.prototype = {

    /**
     * Create a new vote for a given question's id.
     * @param id mongo id of a question.
     */
    openVote: function(id) {
        logger.debug("opening vote for: " + id);
        this.votes[id] = [];
        logger.debug(this.votes[id]);
    },

    closeVote: function(id) {
        //this.votes[id] = undefined;
    },

    /**
     * Save an answer from a student's device.
     * @param id mongo id of a question.
     * @param alternatives Array containing selected alternatives (only one in case of single choice)
     * @return {number} 0 on success, 1 on error (vote not currently open)
     */
    saveAnswer: function(id, alternatives) {
        var alternative;
        if (!this.votes[id] || this.votes[id] === undefined) {
            logger.error('Vote not open for id: ' + id);
            return 1;
        }
        logger.debug("Status of vote for id " + id + " is: " + this.votes[id]);
        alternatives.forEach((alternative) => {
            if (this.votes[id].length < alternative) {
                this.votes[id].length = alternative;
                this.votes[id][alternative - 1] = 0;
            }
            alternative--;//to array index!
            if (!this.votes[id][alternative]) {
                this.votes[id][alternative] = 0;
            }
            logger.debug("Storing vote: " + this.votes[id][alternative]);
            this.votes[id][alternative]++;
        });
        return 0;
    },

    getResults: function (id) {
        var result = new Array(this.votes[id].length),
            index;
        for(index = 0; index < this.votes[id].length; index++) {
            if (!this.votes[id][index]) {
                this.votes[id][index] = 0;
            }
            result[index] = [this.votes[id][index], {label: index + 1}];
        }
        this.closeVote(id);
        return result;
    },

    getResultsAsJSON: function (id) {
        return JSON.stringify(this.getResults(id));
    }
};
