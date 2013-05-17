/**
 * Handle point and click on BYOD.
 */
var init = function () {
},

clickPos,

handleClick = function (event) {
    var image = $('#clickImage'),
        redPoint = $('#RedPoint');
    clickPos = {x: event.offsetX, y: event.offsetY},
    redPoint.css({position: "absolute", visibility: "visible", top: clickPos.y, left: clickPos.x});
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
