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
var dew = {};
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
    activeConnections +=1 ;
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
        io.sockets.to(myRoom).emit('user',userName);        

        socket.on('move',function(data){
            socket.broadcast.to(data.room).emit('move',data); 
        });
        socket.on('mountainDewPos',function(data){
            dew.x = data.x;
            dew.y = data.y;            
            socket.broadcast.to(data.room).emit('mountainDewPos',data); 
        });
        socket.on('mountainDew',function(data){
            socket.broadcast.to(data.room).emit('mountainDew',data); 
        });
        socket.on('join',function(user){
            console.log(roomLord);
            socket.broadcast.to(user.room).emit('join', user); 
            socket.broadcast.to(user.room).emit('mountainDewPos',dew);
        });


    }
    io.sockets.on('disconnect', function(){
        roomLord[myRoom]-=1;
        // to subtract for all users
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
