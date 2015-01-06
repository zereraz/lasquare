$(document).ready(function(){

    /*
        //socket object
        var socket; 
        var canvas,ctx,me; 
        var userId = -1;
        var dew = [];
        var otherPlayers = [];
        var roomId;
        var dewX = [];
        var dewY = [];
        var score = 0;
        var scoreCanvas,scoreCtx;
        var alive = true;

        function init(){

        scoreCanvas = document.getElementById('myScore');
        scoreCtx = scoreCanvas.getContext('2d');
        putScore();
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
        var randomX = random(0,500);
        var randomY = random(0,500);
        me = new Square(randomX,randomY,35,35,"#e21",10);
        me.draw(); 
        socket = io();

        }

        function random(low,high){

        return Math.floor(Math.random()*(high-low)+low);

        }

        function putScore(){

        scoreCtx.clearRect(0,0,scoreCanvas.width,scoreCanvas.height);
        scoreCtx.fillStyle = "#e21";
        scoreCtx.font = "40px Georgia";
        scoreCtx.fillText(score,0,35);

        }

        function addToScore(s){

        score += s;
        putScore();
        }

        function generateMountainDew(){

        var temp = {};
        temp.x = [];
        temp.y = [];
        if(userId===0){
        for(var i = 0;i<2;i++){
        var randomX = random(0,500); 
        var randomY = random(0,500);
        dew.push(new Square(randomX,randomY,10,10,"#6fe63a",0)); 
        dew[i].draw();
        temp.x[i] = randomX;
        temp.y[i] = randomY;
        temp.room = roomId;
        socket.emit('mountainDewPos', temp);
        }
        }else{ 
        for(var j = 0;j<2;j++){
        dew.push(new Square(dewX[j],dewY[j],10,10,"#6fe63a",0)); 
        dew[j].draw();
        }
}
}

function Square(x,y,width,height,color,velocity){

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.color = color;
    this.isMoving = false;
    return this;

} 

Square.prototype.draw = function(){
    ctx.clearRect(this.x,this.y,this.width,this.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
};

Square.prototype.collisionDetection = function(){
    // Collision with DEW
    for(var i=0;i<dew.length;i++){
        if(dew[i].x<this.x+this.width && dew[i].x+dew[i].width > this.x && dew[i].y<this.y+this.height && dew[i].y+dew[i].height>this.y){
            dew[i].erase();
            dew.splice(i,1);
            this.velocity += 10;
            var temp = {};
            temp.uid = userId;
            temp.room = roomId;
            socket.emit('mountainDew',temp);
            addToScore(5);
        }
    }

    // Collision with other squares
    for(i = 0; i<otherPlayers.length ;i++){
        console.log(otherPlayers[i]);
        if(otherPlayers[i].x < this.x + this.width && otherPlayers[i].x + otherPlayers[i].width > this.x && otherPlayers[i].y<this.y + this.height && otherPlayers[i].y + otherPlayers[i].height>this.y){
            otherPlayers[i].erase();
            otherPlayers.splice(i,1);
            score += 1;
            var temp = {};
            temp.uid = i;
            temp.room = roomId;
            socket.emit('killed',temp);
            console.log("this "+this.isMoving);
            console.log(otherPlayers[i].isMoving);
        }
    }
};


Square.prototype.erase = function(){

    ctx.clearRect(this.x,this.y,this.width,this.height);
}; 

Square.prototype.moveUp = function(){

    if(this.y>0){
        this.collisionDetection();
        ctx.fillStyle = this.color;
        ctx.clearRect(this.x,this.y,this.width,this.height);
        this.y = this.y-this.velocity;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        var toSend = this;
        toSend.dir = "up";
        socket.emit('move',toSend);
    } 
    this.isMoving = false; 
};

Square.prototype.moveLeft = function(){

    if(this.x>0){
        this.collisionDetection();
        ctx.fillStyle = this.color;
        ctx.clearRect(this.x,this.y,this.width,this.height);
        this.x = this.x-this.velocity;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        var toSend = this;
        toSend.uid = userId;
        toSend.dir = "left";
        socket.emit('move',toSend);
    } 
    this.isMoving = false; 
};

Square.prototype.moveRight = function(){

    if(this.x+this.width<500){
        this.collisionDetection();
        ctx.fillStyle = this.color;
        ctx.clearRect(this.x,this.y,this.width,this.height);
        this.x = this.x+this.velocity;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        var toSend = this;
        toSend.uid = userId;
        toSend.dir = "right";
        socket.emit('move',toSend);
    }
    this.isMoving = false; 
};

Square.prototype.moveDown = function(){

    if(this.y+this.height<500){
        this.collisionDetection();
        ctx.fillStyle = this.color;
        ctx.clearRect(this.x,this.y,this.width,this.height);
        this.y = this.y+this.velocity;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        var toSend = this;
        toSend.uid = userId;
        toSend.dir = "down";
        socket.emit('move',toSend);
    }
    this.isMoving = false; 
};

init();

//
// keypress
//

$(document).keypress(function(e){
        if(alive){
        // console.log(e.which);
        //w a s d

        // w or up arrow key
        if(e.which == 119|| e.keyCode == 119 || e.which == 38 || e.keyCode == 38){
        me.moveUp();
        me.isMoving = true;
        }

        //a
        if(e.which == 97|| e.keyCode == 97){

        me.moveLeft(); 
        me.isMoving = true;
        }

        // s
        if(e.which == 115|| e.keyCode == 115){

            me.moveDown(); 
            me.isMoving = true;
        }

        // d
        if(e.which == 100 || e.keyCode == 100){

            me.moveRight(); 
            me.isMoving = true;
        }
        }
});

function moveThat(userId, direction){
    switch(direction){

        case "up":
            otherPlayers[userId-1].moveUp();
            break;
        case "down":
            otherPlayers[userId-1].moveDown();
            break;
        case "left":
            otherPlayers[userId-1].moveLeft();
            break;
        case "right":
            otherPlayers[userId-1].moveRight();
            break;
    }
}

socket.on('move',function(data){
        var uid = data.uid;
        var dir = data.dir;
        moveThat(uid,dir);
        });

socket.on('join', function(data){
        var temp = new Square(data.x,data.y,data.width,data.height,data.color,data.velocity);
        temp.draw(); 
        otherPlayers.push(temp);
        var toSend = {};
        toSend.otherPlayers = otherPlayers;
        toSend.room = myRoom;
        socket.emit('allPlayersSoFar', toSend);    
        socket.emit('mountainDewPos', temp);
        });

socket.on('myId', function(id){
        if(userId === -1){
        userId = id;
        me.uid = userId;
        me.room = roomId;
        }
        socket.emit('join',me);
        if(userId === 0){
        generateMountainDew();
        } 
        });  

socket.on('myRoom', function(myRoom){
        roomId = myRoom;
        me.room = roomId;
        });

socket.on('mountainDewPos', function(data){
        for(var i = 0;i<2;i++){
        dewX[i] = data.x[i];
        dewY[i] = data.y[i]; 
        }
        if(userId!==0){
        generateMountainDew();
        }
        });

socket.on('mountainDew', function(data){
        if(dew.length != 1){
        otherPlayers[data.uid-1].velocity+=10;
        }
        });
socket.on('killed', function(data){
        addToScore(10);                 
        });
socket.on('allPlayersSoFar', function(data){
        otherPlayers = data.otherPlayers;
        for(var i=0;i<otherPlayers.length;i++){
        otherPlayers[i].draw();
        }        
        });

*/


    // Main playing area
    var canvas,ctx;
    // Score area
    var score,sctx;
    // information area
    var info,ictx;

    // Socket object
    var socket;

    // this player
    var me; 
    // Contains objects of all players in room
    var allPlayers = [];
    // status : room,id,username
    var status;

    function init (){
        socket = io();
        // Main drawing canvas
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');

        // Score display
        score = document.getElementById('myScore');
        sctx = score.getContext('2d');

        // Information display
        info = document.getElementById('myInfo');
        ictx = info.getContext('2d');

        // Stamina bar display
        stamina = document.getElementById('myStamina');
        stctx = stamina.getContext('2d');

        // Create player
        me = new Player(random(10,440), random(10,440), 40, 40, randomColor());

        // Draw player
        me.draw();

        drawBorder();
        drawStamina();
        setScore(0);
        getStatus();

    }

    function setScore(s){

        sctx.clearRect(10,30,50,50);
        sctx.fillStyle = randomColor();
        sctx.font = "40px Georgia";
        sctx.fillText(s,10,30,50,50);
    }

    // clear info
    function clearInfo(){

        ictx.clearRect(0,0,info.width,info.height);
    }

    // Set info to s at y position
    function infoText(s,y){

        ictx.fillStyle = randomColor();
        ictx.font = "18px Georgia";
        ictx.fillText(s,10,y,70,70);
    }
    // Refresh info
    function getStatus(){

        clearInfo();
        infoText("alive : "+me.alive,30);
        infoText("stuck : "+me.isStuck,60);

    }

    function drawBorder(){ 

        ctx.lineWidth   = 5;
        ctx.strokeStyle = randomColor();
        ctx.strokeRect(5,5,490,490);

    }

    function drawStamina(){

        stctx.fillStyle = randomColor();
        stctx.clearRect(0, 0, stamina.width, stamina.height);
        stctx.fillRect(0, 0, stamina.width,me.stamina);

    }


    function random (low, high){

        return Math.floor(Math.random() * (high - low) + low);

    }

    function randomColor (){

        var color = "#";
        var toSelectFrom = "0123456789ABCDEF";
        for(var i = 0; i<6; i++){
            var j = random(0,16); 
            color += toSelectFrom[j];
        }
        return color;

    }

    // Stop moving for time 
    function stopMovingFor (time){ 
        me.isStuck = true;
        getStatus();
        var timeout = setTimeout(function(){

            if(me.stamina <= 0 && me.isStuck){
                me.stamina = 500;
            }        
            me.isStuck = false;  
            getStatus();
        }, time);


    }
    // on enemy move, show movement
    function moveThat(userId, direction){
        console.log(userId);
        switch(direction){

            case "up":
                allPlayers[userId].moveEnemyUp();
            break;
            case "down":
                allPlayers[userId].moveEnemyDown();
            break;
            case "left":
                allPlayers[userId].moveEnemyLeft();
            break;
            case "right":
                allPlayers[userId].moveEnemyRight();
            break;
        }
    }

    function checkIfDeadOrAlive(a,b){
        if(a.isMoving && b.isMoving){
            // both alive
            return 1; 
        }else if(a.isMoving && !b.isMoving){
            // 'a' is alive 'b' is dead
            return 0;
        }else{
            // 'b' is alive 'a' dead
            return -1;
        }
    }

/*%%%%%%%%%%%%%%%%%%%%
 *
 *
 *  Constructors   
 *
 *
 %%%%%%%%%%%%%%%%%%%%*/


    // The square i.e the player
    function Player (x, y, width, height, color, name){ 

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocity = 15;
        this.alive = true;
        this.isMoving = false;
        this.name = name; 
        this.isStuck = false;
        this.stamina = 500;
    }


    // Extra speed, points
    function MountainDew (point,x,y,width,height,color){

        this.x = x;
        this.y = y;
        this.width = point * width;
        this.height = point * height;
        this.color = color;

    }

    Player.prototype.draw = function (){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);

    };

    Player.prototype.clearMe = function (){ 
        ctx.clearRect(this.x,this.y,this.width,this.height);
    };

    Player.prototype.drawId = function (){
        
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = randomColor();
        if(this.alive){
            ctx.font = "18px Georgia";
            ctx.fillText(this.id,this.x+this.width/4,this.y+this.height/2,this.width,this.height);
        }else{
            ctx.font = "12px Georgia";
            ctx.fillText("DEAD",this.x+this.width/6,this.y+this.height/2,this.width,this.height);
        }
    };

    $(document).keypress(function(e){
        if(me.alive && !me.isStuck){

            // console.log(e.which);

            //w a s d

            // w or up arrow key

            if(e.which == 119|| e.keyCode == 119 || e.which == 38 || e.keyCode == 38){
                me.moveUp();
            }

            //a
            if(e.which == 97|| e.keyCode == 97){

                me.moveLeft(); 
            }

            // s
            if(e.which == 115|| e.keyCode == 115){

                me.moveDown(); 
            }

            // d
            if(e.which == 100 || e.keyCode == 100){

                me.moveRight(); 
            }
        }else{
            if(me.stamina>0){

                stopMovingFor(5000); 
            }
        }
    });

    Player.prototype.collisionDetection = function(b){
        if(b.x < this.x + this.width && b.x + b.width > this.x && b.y < this.y + this.height && b.y + b.height > this.y){
            var result = checkIfDeadOrAlive(this,b);
            switch(result){
                case 1:
                    console.log("Both alive"); 
                    break;
                case 0: 
                    allPlayers[b.id].clearMe();
                    allPlayers.splice(b.id,1);
                    var toSend = b; 
                    toSend.killedBy = this;
                    socket.emit('dead', toSend);
                    break;
                case -1:                
                    me.alive = false;
                    me.draw(); 
                    me.drawId();
                    break;
            }
        } 

    };

    Player.prototype.moveUp = function(){

        if(!this.isStuck){
            this.isMoving = true;
            if(this.y>10){
                if(allPlayers.length>1){
                        for(var i=0;i<allPlayers.length;i++){
                            if(allPlayers[i]!==undefined){
                                this.collisionDetection(allPlayers[i]);
                            }
                        }
                    }
                    this.decreaseStamina();
                    this.clearMe();
                    this.y = this.y-this.velocity;
                    this.draw();
                    this.drawId();
                    var toSend = this;
                    toSend.dir = "up";
                    toSend.uid = status.id;
                    socket.emit('move',toSend);
                }
                else{
                    this.isStuck = true;
                }
            } 
            this.isMoving = false; 
        };

        Player.prototype.moveLeft = function(){

            if(!this.isStuck){
                this.isMoving = true;

                if(this.x>10){
                    if(allPlayers.length>1){
                        for(var i=0;i<allPlayers.length;i++){
                             if(allPlayers[i]!==undefined){
                                this.collisionDetection(allPlayers[i]);
                            }
                        }
                    }
                    this.decreaseStamina();
                    this.clearMe();
                    ctx.clearRect(this.x,this.y,this.width,this.height);
                    this.x = this.x-this.velocity;
                    this.draw();
                    this.drawId();
                    var toSend = this;
                    toSend.uid = status.id;
                    toSend.dir = "left";
                    socket.emit('move',toSend);
            }
            else{
                this.isStuck = true;
            }
        } 

        this.isMoving = false; 
    };

    Player.prototype.moveRight = function(){

        if(!this.isStuck){
            this.isMoving = true;

            if(this.x+this.width < 490){
                if(allPlayers.length>1){

                    for(var i=0;i<allPlayers.length;i++){
                            if(allPlayers[i]!==undefined){
                                this.collisionDetection(allPlayers[i]);
                            }
                    }
                }
                this.decreaseStamina();
                this.clearMe();
                ctx.clearRect(this.x,this.y,this.width,this.height);
                this.x = this.x+this.velocity;
                this.draw();
                this.drawId();
                var toSend = this;
                toSend.uid = status.id;
                toSend.dir = "right";
                socket.emit('move',toSend);
            }
            else{
                this.isStuck = true;
            }
        } 

        this.isMoving = false; 
    };

    Player.prototype.moveDown = function(){

        if(!this.isStuck){
            this.isMoving = true;

            if(this.y+this.height < 490){
                if(allPlayers.length>1){
                    for(var i=0;i<allPlayers.length;i++){
                            if(allPlayers[i]!==undefined){
                                this.collisionDetection(allPlayers[i]);
                            }
                    }
                }
                this.decreaseStamina();
                this.clearMe();
                this.y = this.y+this.velocity;
                this.draw();
                this.drawId();
                var toSend = this;
                toSend.uid = status.id;
                toSend.dir = "down";
                socket.emit('move',toSend);
            }
            else{
                this.isStuck = true;
            } 
        }

        this.isMoving = false; 
    };

    Player.prototype.decreaseStamina = function(){

        if(this.stamina>0){

            this.stamina -= this.velocity;
            drawStamina();
        }else{
            stopMovingFor(2000); 
            drawStamina(); 
        }
    };

    Player.prototype.moveEnemyUp = function(){

        if(this.y>10){
            this.isMoving = true; 
            this.clearMe();
            this.y = this.y-this.velocity;
            this.draw();
            this.drawId();
            var toSend = this;
        }
        this.isMoving = false; 
    };

Player.prototype.moveEnemyLeft = function(){
   
    if(this.x>10){
        this.isMoving = true; 
        this.clearMe();
        ctx.clearRect(this.x,this.y,this.width,this.height);
        this.x = this.x-this.velocity;
        this.draw();
        this.drawId();
    }
        this.isMoving = false; 

};

Player.prototype.moveEnemyRight = function(){

    if(this.x+this.width < 490){
        this.isMoving = true;
        this.clearMe();
        ctx.clearRect(this.x,this.y,this.width,this.height);
        this.x = this.x+this.velocity;
        this.draw();
        this.drawId();
    }
        this.isMoving = false; 
};

Player.prototype.moveEnemyDown = function(){

    if(this.y+this.height < 490){
        this.isMoving = true;
        this.clearMe();
        ctx.clearRect(this.x,this.y,this.width,this.height);
        this.y = this.y+this.velocity;
        this.draw();
        this.drawId();
    }
    this.isMoving = false; 
};

init();

// socket on events
socket.on('status', function(data){
    status = data;
    me.name =status.username;
    me.id = status.id;
    me.drawId();
    $('#stats').html('<h3>room : '+status.room+'</h3><h3> username : '+status.username+'</h3><h3> id : '+status.id+'</h3>');
    var toSend = me;
    toSend.room = status.room;
    toSend.username = status.username;
    toSend.id = status.id;
    toSend.sid = status.sid;
    socket.emit('join',toSend);
});


// when a user joins
// add it to list
// draw it

socket.on('join', function(userData){
    // I joint before you, nice to meet you. I shall kill you
    // send my info to the newly joint square 
    var enemy = new Player(userData.x,userData.y,userData.width,userData.height,userData.color,userData.username);
    enemy.sid = userData.sid;
    enemy.id = userData.id;
    enemy.room = userData.room;
    enemy.username = userData.username;
    allPlayers[userData.id] = enemy;
    enemy.draw();
    enemy.drawId();
    var toSend = me;
    toSend.room = status.room;
    toSend.username = status.username;
    toSend.id = status.id;
    toSend.sid = status.sid;
    toSend.socketId = userData.sid;
    socket.emit('myInfo', toSend);

});

socket.on('myInfo', function(enemy){
    // another player that came before me, my enemy
    var newEnemy = new Player(enemy.x,enemy.y,enemy.width,enemy.height,enemy.color,enemy.username);
    newEnemy.sid = enemy.sid;
    newEnemy.id = enemy.id;
    newEnemy.room = enemy.room;
    newEnemy.username = enemy.username;
    allPlayers[enemy.id] = newEnemy;
    newEnemy.draw();
    newEnemy.drawId();
});


socket.on('move',function(data){
    var uid = data.uid;
    var dir = data.dir;
    moveThat(uid,dir);
});

socket.on('gameOver', function(data){
    me.alive = false;
    alert("you were killed");
    me.draw();
    me.drawId();
});

// New Game

var newGame = $('#newGame');
newGame.on('click', function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    me.alive = true;
    me.draw();
    for(var i=0;i<allPlayers.length;i++){
        if(allPlayers[i]!== undefined){
            allPlayers[i].draw();
            allPlayers[i].drawId();
        }
    }
});

});

