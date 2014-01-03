var i18n = require("i18n");

exports.index = function(req, res){
  console.log(req.query.locale || "en")
  res.cookie('locale', req.query.locale || i18n.configure.defaultLocale);
  joinchannel = req.query.channel || config.channel;
  if(joinchannel[0] != "#"){
    joinchannel = "#" + joinchannel;
  }
  res.render('index', {
    title: joinchannel + ' ichat.io',
    joinchannel: joinchannel,
    __: i18n.__
  });
};