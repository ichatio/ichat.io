exports.index = function(req, res){
  joinchannel = req.query.channel || config.channel;
  if(joinchannel[0] != "#"){
    joinchannel = "#" + joinchannel;
  }
  res.render('index', {
    title: joinchannel + ' ichat.io',
    joinchannel: joinchannel
  });
};