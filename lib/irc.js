module.exports = function(io) {
  var irc = require('irc');

  io.sockets.on('connection', function(socket) {

    socket.on('connect', function(nickname, username, password, joinchannel) {
      joinchannel = joinchannel || config.channel

      socket.emit('info', '- IRClife WebIRC v 0.1.2 -');

      var client = new irc.Client(config.server, nickname, {
        channels: [ joinchannel ],
        userName: 'IRClifeChat',
        realName: 'Client web IRClife'
      });

      socket.client = client;

      client.on('motd', function(motd) {
        socket.emit('info', motd);
      });

      client.on('join', function(channel, nick, message) {
        socket.emit('join', channel, nick, message);
      });

      client.on('topic', function(channel, topic, nick, message) {
        socket.emit('topic', channel, topic, nick, message);
      });

      client.on('names', function(channel, nicks) {
        socket.emit('names', channel, nicks);
      });

      client.on('message', function(from, to, text, message) {
        socket.emit('message', from, to, text, message);
      });

      client.on('error', function(error) {
        console.log(error);
        socket.emit('error', error);
      });
    });

    socket.on('say', function(to, text) {
      socket.client.say(to, text);
    });

    socket.on('disconnect', function() {
      if(!socket.client) return;

      socket.client.disconnect('user disconnected');
    });
  });
};