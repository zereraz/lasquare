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
 *  Listening on port 3000
 *
 * %%%%%%%%%%%%%%%%%%*/

http.listen(port, function(){

    console.log("Listening to port : "+port);

});
