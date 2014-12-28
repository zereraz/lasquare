/*%%%%%%%%%%%%%%%%%%%%
*
* Dependencies & Global Variables
*
* 
*%%%%%%%%%%%%%%%%%%%%*/

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http,{transport:['websocket','polling']});

var roomLord = {};

/*%%%%%%%%%%%%%%%%%%%%
*
*   Middleware & Routes
*
* 
*%%%%%%%%%%%%%%%%%%%%*/

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

/*%%%%%%%%%%%%%%%%%%%%
 *
 * Routes 
 *
 * %%%%%%%%%%%%%%%%%%*/

app.get('/', index.home);
app.get('/room',room.gRoom);
app.post('/room',room.pRoom);

/*%%%%%%%%%%%%%%%%%%%%
 *
 * Socket events 
 *
 * %%%%%%%%%%%%%%%%%%*/

io.on('connection', function(socket){
    myRoom = room.getRoom();
    activeConnections ++ ;
    if(myRoom!=0){
        userName = room.getUser();
        if(roomLord[myRoom]==undefined){
            roomLord[myRoom] = 0;
        }else{
            roomLord[myRoom] += 1;
        }
        socket.join(myRoom);
        io.sockets.to(myRoom).emit('myRoom',myRoom);
        io.sockets.to(myRoom).emit('myId',roomLord[myRoom]); 
        
        socket.on('move',function(data){
            socket.broadcast.to(data.room).emit('move',data); 
        });

        socket.on('join',function(user){
            socket.broadcast.to(user.room).emit('join', user); 
        });


    }
    io.sockets.on('disconnect', function(){
        activeConnections--;
    });
});


/*%%%%%%%%%%%%%%%%%%%%
 *
 *  Listening on port 3000
 *
 * %%%%%%%%%%%%%%%%%%*/

http.listen(port, function(){

    console.log("Listening to port : "+port);

});
