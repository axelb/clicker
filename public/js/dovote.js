/**
 * This file contains all callback functions for voting on BYODs.
 * This BYOD code is NOT based on angular!
 */
'use strict';

/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "init" }]*/
var init = function() {},

/**
 * Callbacks for success and failure of ajax calls.
 */
success = function(res) {
    $('#body').html(res);
    history.pushState({}, '', '');//single push on back button does not work
},
error = function(jqXHR, textStatus, errorThrown) {
    alert(textStatus + ': ' + jqXHR.responseText);
},

/**
 * This function is used for transfer of SC and MC votes.
 */
sendMCResults = function() {
    var questionId = $('#questionId')[0].value,
        selectedAlternatives = $('input[name=alternative]:checked', '#voteForm'),
        response = {vote: {id: questionId, alternatives: []}};
    selectedAlternatives.each(function(){response.vote.alternatives.push($(this).val());});

    $.ajax({
        url: '/saveAnswer/mc/',
        type:'POST',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(response)})
        .done(success)
        .fail(error);
},

/**
 * Callback function to enable/disable submit button on click of an alternative.
 * Works for SC (radio buttons used) as well as for MC (checkboxes used) questions.
 */
validate = function(element) {
    var checkboxes;
    // radio cannot be switched off again (I think) - so enable button on any click
    if(element.type === 'radio') {
        $('#sendButton').removeAttr('disabled');
    } else {
        $('#sendButton').attr('disabled', 'disabled');//disable button upfront
        checkboxes = $('.alternative');
        checkboxes.each(function(index, checkbox) {
            if(checkbox.checked) {
                $('#sendButton').removeAttr('disabled');//enable if an alternative is selected
            }
        });
    }
},

clickPos,

handleClick = function (event) {
    var image = $('#clickImage')[0],
        redPoint = $('#RedPoint'),
        pointSize = 20;
    clickPos = relativeMouseCoordinates(event, image);
    redPoint.css({position: 'absolute', visibility: 'visible', width: pointSize, height: pointSize, top: clickPos.y - pointSize / 2, left: clickPos.x - pointSize / 2});
    // Now calculate relative coordinates in the image
    clickPos.x = clickPos.x / image.width;
    clickPos.y = clickPos.y / image.height;
    $('#sendButton').removeAttr('disabled');
},

/**
 * Helper function to  determine click position by recursively inspecting parent elements.
 */
relativeMouseCoordinates = function(event, currentElement) {
    var totalOffsetX = 0,
        totalOffsetY = 0,
        imageX = 0,
        imageY = 0;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        currentElement = currentElement.offsetParent;
    }
    while(currentElement != null);

    imageX = event.pageX - totalOffsetX;
    imageY = event.pageY - totalOffsetY;

    return {x: imageX, y: imageY};
},

sendPointResults = function() {
    var questionId =  $('#questionId')[0].value;
    $.ajax({
        url: '/saveAnswer/point/',
        type:'POST',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({vote: {id: questionId, results: clickPos}})
    })
        .done(success)
        .fail(error);
},

sendClozeResults = function() {
    var results = {},
        questionId =  $('#questionId')[0].value;
    $('.clozeTextField').each(function() {
        var textId = this.id,
            textValue = this.value;
        results[textId] = textValue;
    });
    $('.clozeTextArea').each(function() {
        var textId = this.id,
            textValue = this.value;
        results[textId] = textValue;
    });
    $.ajax({
        url: '/saveAnswer/cloze/',
        type:'POST',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({id: questionId, results: results})
    })
        .done(success)
        .fail(error);
};
