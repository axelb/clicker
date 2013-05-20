/**
 * Handle point and click on BYOD.
 */
var init = function () {
},

clickPos,

handleClick = function (event) {
    var image = $('#clickImage'),
        redPoint = $('#RedPoint'),
        pointSize = 20;
    clickPos = {x: event.offsetX, y: event.offsetY};
    redPoint.css({position: "absolute", visibility: "visible", width: pointSize, height: pointSize, top: clickPos.y - pointSize / 2, left: clickPos.x - pointSize / 2});
    $('#sendButton').removeAttr("disabled");
},

sendPointResults = function(id) {
    var questionId =  $('#questionId')[0].value;
    $.ajax({url: '/saveAnswer/point/', type:'PUT', data: {vote: {id: questionId, results: clickPos}}})
        .done(function(res) {
            $('#body').html(res);
            history.pushState({}, "", "");//single push on back button does not work
    })
        .fail(
        function(jqXHR, textStatus, errorThrown) {
            alert(textStatus + ": " + jqXHR.responseText);
        });
};
