/**
 * Node module VoteCollector class.
 * A vote collector once opened collects incoming votes from student's (audience) devices (BYOD).
 * It simply counts up results in an array. A vote for a questionmust be opened explicitly and it will
 * be closed  when results are queried (NYI).
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
        console.log("opening vote for: " + id);
        this.votes[id] = [];
        console.log(this.votes[id]);
    },

    closeVote: function(id) {
        //this.votes[id] = undefined;
    },

    /**
     * Save an answer from a student's device.
     * @param id mongo id of a question.
     * @param alternative Selected alternative
     * @return {number} 0 on success, 1 on error (vote not currently open)
     */
    saveAnswer: function(id, alternative) {
        if(!this.votes[id] || this.votes[id] === undefined) {
            console.log('Vote not open for id: ' + id);
            return 1;
        }
        console.log(this.votes[id]);
        if(this.votes[id].length < alternative) {
            this.votes[id].length = alternative;
            this.votes[id][alternative - 1] = 0;
        }
        alternative--;//to array index!
        if(!this.votes[id][alternative]) {
            this.votes[id][alternative] = 0;
        }
        console.log(this.votes[id][alternative]);
        this.votes[id][alternative]++;
        return 0;
    },

    getResults: function (id) {
        var result = new Array(this.votes[id].length)
          , i;
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
