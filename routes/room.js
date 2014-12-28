var roomId;
var userName;
exports.gRoom = function(req,res){
    res.render('room');
}

exports.getRoom = function(){
    return roomId;
}

exports.getUser = function(){
    return userName;
}

exports.pRoom = function(req,res){
    userName = req.body.uname;
    roomId = req.body.roomId;
    res.render('room');
}
