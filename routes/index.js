
/*
 * GET home page.
 */

exports.index = function(req, res){
  joinchannel = req.query.channel || "irclife";
  res.render('index', {
    title: joinchannel + ' Chat',
    joinchannel: "#" + joinchannel
  });
};