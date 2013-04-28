var init = function() {
    var qid = $('#qid').attr('name');
    $.ajax('/results/cloze/' + qid).done(function (data) {
           $('#allResults').html(data);
    });
};

