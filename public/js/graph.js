var init = function() {
  var qid = $('#qid').attr('name');
  drawVisualization(qid);
}

function drawVisualization(id) {
  $.ajax('/results/' + id).done(function(data) {
    jQuery('#graph').tufteBar({
      data: data,
      barWidth: 0.5, 

      //axisLabel: function(index) { return 'Alternative'; }, 

      // The color of the bar
      color:     function(index) {
        return ['#0040D5', '#C82000', '#49BE00', '#8200B9', '#00C687'][index % 5];
      },
      legend: {
        data: ["1", "2", "3", "4", "5", "6"]
      }

    });
  });
}
