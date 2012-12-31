var init = function() {
  var qid = $('#qid').attr('name');
  $.ajax('/question/json/' + qid).done(function(question) {
      drawVisualization(qid, JSON.parse(question));
  });
};

function drawVisualization(id, question) {
  $.ajax('/results/' + id).done(function(data) {
    console.log();
    jQuery('#graph').tufteBar({
      data: data,
      barWidth: 0.5, 

      axisLabel: function(index) { 
        return "";
      }, 

      color: function(index) {
        return ['#0040D5', '#C82000', '#49BE00', '#8200B9', '#00C687'][index % 5];
      },

      legend: {
        data: question.alternatives,
        label: function(index) {
          return question.alternatives[index].title;
        },
        color: function(index) {
          return ['#0040D5', '#C82000', '#49BE00', '#8200B9', '#00C687'][index % 5];
        }
      }

    });
  });
}
