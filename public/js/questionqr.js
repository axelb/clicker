var init = function() {
    var host = window.location.hostname
       , port = window.location.port ? ":" + window.location.port : "" // avoid a lonely colon and thus an invalid url in production
       , id = $('#qrcode').attr('value');
    $('#qrcode').qrcode({width: 1024, height: 1024, text: 'http://' + host + port + '/question/' + id});
};
