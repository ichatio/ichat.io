;(function ($, window, undefined) {
  'use strict';
  var currentChannel = null;
  var channels = {};
  var privates = [];
  var nickname = null;
  var joinchannel = null;

  $(document).ready(function() {
    $('#login').reveal();

    $('#authenticate').change(function() {
      if($(this).is(':checked')) {
        $('#services').show();
      } else {
        $('#services').hide();
      }
    });

    $('#connect').click(function(e) {
      e.preventDefault();

      $('#login').trigger('reveal:close');

      nickname = $('#nickname').val();
      joinchannel = $('#channel').val();

      var socket = io.connect();

      socket.emit('connect', nickname, '', '', joinchannel);

      socket.on('join', function(channel, nick, message) {
        if(nick === nickname) {
          channels[channel] = {};
          currentChannel = channel;

          // Add tab
          var tabSource = $('#tab-template').html();
          var tabTemplate = Handlebars.compile(tabSource);
          var tab = tabTemplate({ target: channel });

          if (!document.querySelector("#tabs a[data-target='"+channel+"']")) {
            $('#tabs').append(tab);
          }
          activateTabs();

          // Add window
          var winSource = $('#window-template').html();
          var winTemplate = Handlebars.compile(winSource);
          channel = channel.replace('#', '');
          var win = winTemplate({ target: channel });

          $('#windows').append(win);
          window.setTimeout(function(){$('#tabs a').click();}, 2000);
        }
      });

      socket.on('topic', function(channel, topic, nick, message) {
        //console.log(channel, topic, nick, message);
        if(channels[channel]) {
          channels[channel].topic = topic;
        }
      });

      socket.on('names', function(channel, nicks) {
        if(channels[channel]) {
          channels[channel].nicks = nicks;
        }
      });

      socket.on('message', function(from, to, text, message) {
        if(channels[to]) {
          console.log(message);
          if(~to.indexOf('#')) {

            var msgSource = $('#message-template').html();
            var msgTemplate = Handlebars.compile(msgSource);
            var msg = msgTemplate({ nickname: from, message: text });

            $(to).append(msg);
            scrollBottom($(to).get(0));
          }
        }
      });

      socket.on('info', function(info) {
        $('#status').append('<pre>' + info + '</pre>');
        scrollBottom($("#status").get(0));
      });

      socket.on("disconnect", function() {
        $("#status").append($('<pre>').append("<b>connection closed unexpectedly</b>"));
        scrollBottom($("#status").get(0));
      });

      socket.on('reconnect', function () {
        $("#status").append($('<pre>').append("reconnected to the server"));
        socket.emit('connect', nickname, '', '', joinchannel);
        scrollBottom($("#status").get(0));

      });

      socket.on('reconnecting', function () {
        $("#status").append($('<pre>').append("attempting to re-connect to the server"));
        scrollBottom($("#status").get(0));
      });

      socket.on('error', function (e) {
        console.log(e.args);
        if(e.command != "undefined"){
          $("#status").append($('<pre>').append('Error: ' + e.command));
        }
        scrollBottom($("#status").get(0));
      });

      $('#message-text').keydown(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          var message = $(this).val();
          if(message[0] == "/"){
            var command = message.split(" ")[0].replace("/", "");
            $(this).val('');
          } else {
            socket.emit('say', currentChannel, message);
            $(this).val('');

            // Add message
            var msgSource = $('#message-template').html();
            var msgTemplate = Handlebars.compile(msgSource);
            var msg = msgTemplate({ nickname: nickname, message: message });

            $(currentChannel).append(msg);
            scrollBottom($(currentChannel).get(0));
          }
        }
      });
    });

    activateTabs();

  });

  function activateTabs() {
    $('.tab').unbind('click');

    $('.tab').click(function(e) {
      e.preventDefault();

      $('.tab').addClass('secondary');
      $(this).removeClass('secondary');

      $('.window').hide();
      var target = $(this).data('target');

      if(~target.indexOf('#')) {
        $(target).show();

        var nicks = channels[target].nicks;

        $('#users').empty();
        var nul = $('<ul>');
        for(var nick in nicks) {
          var nli = $("<li>")
          if(nicks[nick] == "@"){
            var nick_class = "op";
          }else if(nicks[nick] == "+"){
            var nick_class = "voice";
          }else{
            var nick_class = "user";
          }
          nli
            .addClass(nick_class)
            .text(nicks[nick] + nick)
            .appendTo(nul)
        }
        $(nul).children("li").sort(function(a, b) {
          return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
        }).appendTo(nul);

        $('#users').append(nul);

        $('#users').show();
      } else if(target == 'status') {
        $('#status').show();
        $('#users').hide();
      } else {
        $('#nick_' + target).show();
      }

    });
  }

  function scrollBottom(dom_object)
  {
    dom_object.scrollTop = dom_object.scrollHeight;
  }

})(jQuery, this);
