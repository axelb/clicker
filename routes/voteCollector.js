exports.VoteCollector = function () {
    this.votes = {};
};

exports.VoteCollector.prototype = {
    openVote: function(id) {
        console.log("opening vote for: " + id);
        this.votes[id] = [];
        console.log(this.votes[id]);
    },

    closeVote: function(id) {
        
    },

    saveAnswer: function(id, alternative) {
        if(!this.votes[id] || this.votes[id] === undefined) {
            console.log('Vote not open: ' + id);
            return;
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
        console.log(this.votes[id]);
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
        return result;
       /* [5, {label: '1'}],
        [15, {label: '2'}],
        [6, {label: '3'}],
        [12, {label: '4'}]
      ];*/
    },

    getResultsAsJSON: function (id) {
        return JSON.stringify(this.getResults(id));
    }
};
