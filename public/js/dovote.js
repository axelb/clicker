var init = function(){
},

send = function() {
    var altSelected = $('input[name=alternative]:checked', '#voteForm').val(),
        questionId = $('#questionId')[0].value,
     response = {vote: {id: questionId, alternative: altSelected}};
        $.ajax({url: '/saveAnswer/', type:'PUT', data: response})
        .done(function() {
                 //nothing yet
              })
        .fail(
            function(jqXHR, textStatus, errorThrown)    {
                alert(textStatus + ": "  + errorThrown);
            });
},


validate = function() {
    $('#sendButton').removeAttr("disabled");
};
