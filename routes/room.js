exports.gRoom = function(req,res){
    res.render('room');
}

exports.pRoom = function(req,res){
    var userName = req.body.uname;
    var roomId = req.body.roomId;
    res.render('room');
}
