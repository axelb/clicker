  var init = function() {
        var host = window.location.hostname
           , port = window.location.port
           , id = $('#qrcode').attr('value')
           , url = 'http://' + host + ':' + port + '/voteqr/' + id;
      window.history.pushState({}, '', '/voteqr/' + id);
      //window.location = url;
      $('#qrcode').qrcode({width: 1024, height: 1024, text: 'http://' + host + ':' + port + '/question/' + id});
      //window.location = "http://onlineresponse.org/voteqr/#{id}";
      //window.history.pushState(“bla”, “”, “/voteqr/#{id}”);
  };
