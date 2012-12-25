function drawVisualization(id) {
  $.ajax('/results/' + id).done(function(data) {
    jQuery('#graph').tufteBar({
      data: data,
    /*  data: [
        [5, {label: '1'}],
        [15, {label: '2'}],
        [6, {label: '3'}],
        [12, {label: '4'}]
      ],*/

      // Any of the following properties can be either static values 
      // or a function that will be called for each data point. 
      // For functions, 'this' will be set to the current data element, 
      // just like jQuery's $.each

      // Bar width in arbitrary units, 1.0 means the bars will be snuggled
      // up next to each other
      barWidth: 0.5, 

      //barLabel:  function(index) { 
      //  return data[index][0];
      //}, 

      //axisLabel: function(index) { return 'Alternative'; }, 

      // The color of the bar
      /*color:     function(index) { 
        return ['#E57536', '#82293B'][index % 2];
      },*/

      // Stacked graphs also pass a stackedIndex parameter
      //color:     function(index, stackedIndex) { 
      //  return ['#E57536', '#82293B'][stackedIndex % 2];
      //},

      // Alternatively, you can just override the default colors and keep
      // the built in color functions
      colors: ['#82293B', '#E57536', '#FFBE33']
    });
  });
}
