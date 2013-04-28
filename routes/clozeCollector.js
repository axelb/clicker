/**
 * Node module.
 * Collector class for collecting answers to cloze questions.
 * @type {*}
 */
var log4js = require('log4js'),
    logger = log4js.getLogger('server');

/**
 * @constructor Creates a new ClozeCollector object.
 */
exports.ClozeCollector = function () {
    this.answers = {};
};

exports.ClozeCollector.prototype = {

    /**
     * Create a new voting infrastructure for a given question's id.
     * @param id mongo id of a question.
     */
    openVote: function(id) {
        logger.debug("opening vote for: " + id);
        this.answers[id] = [];
        logger.debug(this.answers[id]);
    },

    saveAnswer: function(id, answers) {
        var answerArray = [answers];
        if(!this.answers[id] || this.answers[id] === undefined) {
            logger.error('Vote not open for id: ' + id);
            return 1;
        }
        this.answers[id].push(answerArray);
        logger.debug(this.answers[id]);
        return 0;
    },

    getResultsAsJSON: function(id) {
        return JSON.stringify({answers: this.answers[id]});
    }

};
