/**
 * Node module.
 * Collector class for collecting answers to cloze questions.
 * @type {*}
 */
var log4js = require('log4js'),
    logger = log4js.getLogger('server'),
    beautify = require('js-beautify').js_beautify;

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

    /**
     * The returned texts(s) of an answer are saved and beautified.
     * I use a JS beautifier. Should reasonably be working for Java on small code snippets as well.
     * @param id
     * @param answers
     * @return {number}
     */
    saveAnswer: function(id, answers) {
        var answerArray,
            attribute;
        for(attribute in answers) {
            answers[attribute] = beautify(answers[attribute], { indent_size: 0 });
        }
        console.log(answers);
        answerArray = [answers]
        if(!this.answers[id] || this.answers[id] === undefined) {
            logger.error('Vote not open for id: ' + id);
            return 1;
        }
        for (string in answerArray) {
            string = beautify(string, { indent_size: 0 });
        }
        this.answers[id].push(answerArray);
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
