var init = function(){
},

send = function() {
    var altSelected = $('input[name=alternative]:checked', '#voteForm').val(),
        questionId = $('#questionId')[0].value,
     response = {vote: {id: questionId, alternative: altSelected}};
        $.ajax({url: '/saveAnswer/', type:'PUT', data: response})
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
