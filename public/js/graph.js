var init = function () {
    var qid = $('#qid').attr('name'),
        converter = new Showdown.converter(),
        questionDiv = $('#question');
    $.ajax('/question/json/' + qid).done(function (questionJson) {
        var question = JSON.parse(questionJson),
            html = converter.makeHtml(question.question);
        questionDiv.html(html);
        drawVisualization(qid, question);
    });
};

function drawVisualization(id, question) {
    $.ajax('/results/mc/' + id).done(function (data) {
        if(data.length === 0) {
            $('#result').html("<h2>Vote not open!</h2>");
            return;
        }
        jQuery('#graph').tufteBar({
            data: data,
            barWidth: 0.5,

            axisLabel: function (index) {
                return "";
            },

            color: function (index) {
                return ['#0040D5', '#C82000', '#49BE00', '#8200B9', '#00C687'][index % 5];
            },

            legend: {
                data: question.alternatives,
                label: function (index) {
                    return question.alternatives[index].title;
                },
                color: function (index) {
                    return ['#0040D5', '#C82000', '#49BE00', '#8200B9', '#00C687'][index % 5];
                }
            }

        });
    });
}
