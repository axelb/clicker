/**
 * This file contains all callback functions for voting on BYODs.
 * This BYOD code is NOT based on angular!
 */
var init = function() {
},

/**
 * Callbacks for success and failure of ajax calls.
 */
success = function(res) {
    $('#body').html(res);
    history.pushState({}, "", "");//single push on back button does not work
},
error = function(jqXHR, textStatus, errorThrown) {
    alert(textStatus + ": " + jqXHR.responseText);
},

sendMCResults = function() {
    var questionId = $('#questionId')[0].value,
        selectedAlternatives = $('input[name=alternative]:checked', '#voteForm'),
        response = {vote: {id: questionId, alternatives: []}};
    selectedAlternatives.each(function(){response.vote.alternatives.push($(this).val());});

    $.ajax({url: '/saveAnswer/mc/', type:'PUT', data: response})
        .done(success)
        .fail(error);
},

validate = function() {
    $('#sendButton').removeAttr("disabled");
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
        .done(success)
        .fail(error);
},

sendClozeResults = function(id) {
    var results = {},
        questionId =  $('#questionId')[0].value;
    $('.clozetext').each(function(index) {
        var textId = this.id,
            textValue = this.value;
        results[textId] = textValue;
    });
    $.ajax({url: '/saveAnswer/cloze/', type:'PUT', data: {vote: {id: questionId, results: results}}})
        .done(success)
        .fail(error);
};
