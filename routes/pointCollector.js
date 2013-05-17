/**
 * Node module.
 * Collector class for collecting answers to point-and-click questions.
 * @type {*}
 */
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
     * @return {number}
     */
    saveAnswer: function(id, answer) {
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
