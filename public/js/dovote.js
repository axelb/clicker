var init = function(){
},

sendMCResults = function() {
    var altSelected = $('input[name=alternative]:checked', '#voteForm').val(),
        questionId = $('#questionId')[0].value,
     response = {vote: {id: questionId, alternative: altSelected}};
        $.ajax({url: '/saveAnswer/mc/', type:'PUT', data: response})
        .done(function(res) {
                 $('#body').html(res);
                 history.pushState({}, "", "");//single push on back button does not work
              })
        .fail(
            function(jqXHR, textStatus, errorThrown) {
                alert(textStatus + ": " + jqXHR.responseText);
            });
},

validate = function() {
    $('#sendButton').removeAttr("disabled");
};

sendClozeResults = function(id) {
    var results = {},
        questionId =  $('#questionId')[0].value;
    $('.clozetext').each(function(index) {
        var textId = this.id,
            textValue = this.value;
        results[textId] = textValue;
    });
    $.ajax({url: '/saveAnswer/cloze/', type:'PUT', data: {vote: {id: questionId, results: results}}}).done(

    ).fail(

    );
};
