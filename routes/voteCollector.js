exports.VoteCollector = function () {
    this.votes = {};
    this.current = -1;
};

exports.VoteCollector.prototype = {
    openVote: function(id) {
        //votes[id] = [];
    },

    closeVote: function(id) {
        
    },

    getResults: function (client) {
        return [
        [5, {label: '1'}],
        [15, {label: '2'}],
        [6, {label: '3'}],
        [12, {label: '4'}]
      ];
    }
};
