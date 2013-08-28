/**
 * Node module VoteCollector class.
 * A vote collector once opened collects incoming votes from student's (audience) devices (BYOD).
 * It simply counts up results in an array. A vote for a question must be opened explicitly and it will
 * be closed  when results are queried (NYI).
 */
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
        var alternative,
            that = this;
        if(!this.votes[id] || this.votes[id] === undefined) {
            logger.error('Vote not open for id: ' + id);
            return 1;
        }
        logger.debug("Status of vote for id " + id + " is: " + this.votes[id]);
        alternatives.forEach(function(alternative) {
            if(that.votes[id].length < alternative) {
                that.votes[id].length = alternative;
                that.votes[id][alternative - 1] = 0;
            }
            alternative--;//to array index!
            if(!that.votes[id][alternative]) {
                that.votes[id][alternative] = 0;
            }
            logger.debug("Storing vote: " + that.votes[id][alternative]);
            that.votes[id][alternative]++;
        });
        return 0;
    },

    getResults: function (id) {
        var result = new Array(this.votes[id].length),
            i;
        for(i = 0; i < this.votes[id].length; i++) {
            if(!this.votes[id][i]) {
                this.votes[id][i] = 0;
            }
            result[i] = [this.votes[id][i], {label: i+1}];
        }
        this.closeVote(id);
        return result;
    },

    getResultsAsJSON: function (id) {
        return JSON.stringify(this.getResults(id));
    }
};
