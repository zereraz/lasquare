/* %%%%%%%%%%%%%%%%%%%%
 *
 * Dependencies & Global Variables
 *
 * 
 * %%%%%%%%%%%%%%%%%%%% */

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http,{transport:['websocket','polling']});

var roomLord = {};
var dew = {};

/* %%%%%%%%%%%%%%%%%%%%
 *
 *   Middleware & Routes
 *
 * 
 * %%%%%%%%%%%%%%%%%%%% */

var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var room = require('./routes/room');
var activeConnections = 0;
var myRoom = 0;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

// parse application/json
app.use(bodyParser.json());

//session
app.use(session({
    secret:'lAStsQuarE',
    cookie:{secret:true}
}));


// js css img
app.use(express.static(__dirname+'/public'));

// jade
app.set('view engine','jade');

// views
app.set('views',__dirname+'/views');

/* %%%%%%%%%%%%%%%%%%%%
 *
 * Routes 
 *
 * %%%%%%%%%%%%%%%%%% */

app.get('/', index.home);
app.get('/room',room.gRoom);
app.post('/room',room.pRoom);

/* %%%%%%%%%%%%%%%%%%%%
 *
 * Socket events 
 *
 * %%%%%%%%%%%%%%%%%% */

io.on('connection', function(socket){
    myRoom = room.getRoom();
    if(myRoom!==0){

        userName = room.getUser();
        // add boolean canjoin to roomLord, that is false
        // after the room population crosses a threshold
        // also add a new array called connected
        // to know which user disconnected find all the active
        // users and then find ultimately the inactive one 
        // should be spliced
        if(roomLord[myRoom]===undefined){
            var idToUser = {};
            idToUser[socket.id] = userName;
            roomLord[myRoom] = {users:1,userList:[idToUser]};
        }else{
            var idToUser = {};
            idToUser[socket.id] = userName;
            roomLord[myRoom].users += 1;
            roomLord[myRoom].userList.push(idToUser);
            
        }
        socket.join(myRoom);
        
        // Status of a room
        var status = {
            "room":myRoom,
            'id':roomLord[myRoom].users,
            'username':userName,
            'sid':socket.id
        };
        socket.emit('status',status);

        socket.on('move',function(data){
            socket.broadcast.to(data.room).emit('move',data); 
        });
/*
        socket.on('mountainDewPos',function(data){
            dew.x = data.x;
            dew.y = data.y;            
            socket.broadcast.to(data.room).emit('mountainDewPos',data); 
        });
        socket.on('mountainDew',function(data){
            socket.broadcast.to(data.room).emit('mountainDew',data); 
        });
*/
        socket.on('join',function(userInfo){
            socket.broadcast.to(userInfo.room).emit('join', userInfo); 
//            socket.broadcast.to(user.room).emit('mountainDewPos',dew);
        });
  /*      socket.on('allPlayersSoFar' , function(data){
            socket.broadcast.to(data.room).emit('allPlayersSoFar',data);
        });
    */
        socket.on('myInfo', function(userInfo){
            io.to(userInfo.socketId).emit('myInfo', userInfo);
        });
    }
    socket.on('disconnect', function(){
/*        console.log("socket rooms");
        console.log(socket.rooms);
        console.log("socket adapter");
        console.log(io.sockets.adapter.rooms);
  */
        console.log(socket.id);
        roomLord[myRoom].users -= 1;
        // to subtract for all users
//        socket.emit('present?',

        console.log("User "+ roomLord[myRoom].users + "disconnected");
    });
});


/* %%%%%%%%%%%%%%%%%%%%
 *
 *  Listening on port 3000
 *
 * %%%%%%%%%%%%%%%%%% */

http.listen(port, function(){

    console.log("Listening to port : "+port);

});
