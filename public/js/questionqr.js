  var init = function() {
  	  var host = window.location.hostname;
      //window.history.pushState(“bla”, “”, “/voteqr/#{id}”)
      //window.location = "http://onlineresponse.org/voteqr/#{id}";
      $('#qrcode').qrcode({width: 1024, height: 1024, text: "http://" + host + "/question/#{id}"});
      //window.location = "http://onlineresponse.org/voteqr/#{id}";
      //window.history.pushState(“bla”, “”, “/voteqr/#{id}”);
  };
