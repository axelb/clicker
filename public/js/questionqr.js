var init = function() {
    var host = window.location.hostname
       , port = window.location.port
       , id = $('#qrcode').attr('value')
       , url = 'http://' + host + ':' + port + '/voteqr/' + id;
    //window.location = url;//creates endless loop of course
    $('#qrcode').qrcode({width: 1024, height: 1024, text: 'http://' + host + ':' + port + '/question/' + id});
};
