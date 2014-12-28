$(document).ready(function(){
    //socket object
    var socket; 
    var canvas,ctx,me; 
    var userId;
    var dew = [];
    var otherPlayers = [];
    var roomId;
    var dewX,dewY;

    function init(){
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

    function generateMountainDew(){
        console.log(userId);
        if(userId==0){
            for(var i =0;i<2;i++){
                var randomX = random(0,500); 
                var randomY = random(0,500);
                dew.push(new Square(randomX,randomY,10,10,"#6fe63a",0)); 
                dew[i].draw();
                var temp = {};
                temp.x = randomX;
                temp.y = randomY;
                temp.room = roomId;
                socket.emit('mountainDewPos', temp);
            }
        }else{
                console.log(dewX);
                for(var i =0;i<2;i++){
                    dew.push(new Square(dewX,dewY,10,10,"#6fe63a",0)); 
                    dew[i].draw();
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    
    Square.prototype.collisionDetection = function(){
        for(var i=0;i<dew.length;i++){
            if(dew[i].x<this.x+this.width && dew[i].x+dew[i].width > this.x && dew[i].y<this.y+this.height && dew[i].y+dew[i].height>this.y){
                dew[i].erase();
                dew.splice(i,1);
                this.velocity+=10;
                var temp = {};
                temp.uid = userId;
                temp.room = roomId;
                socket.emit('mountainDew',temp);
            }
        }
    }
      
     
    Square.prototype.erase = function(){
        ctx.clearRect(this.x,this.y,this.width,this.height);
    } 

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
    }

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
    }

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
    }

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
    }

     init();

     //
     // keypress
     //
    
     $(document).keypress(function(e){
//        console.log(e.which);
        //w a s d

        // w
        if(e.which == 119|| e.keyCode == 119){
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
    });

    socket.on('myId', function(id){
        userId = id;
        me.uid = userId;
        me.room = roomId; 
        generateMountainDew();
        socket.emit('join',me);
    });  

    socket.on('myRoom', function(myRoom){
        roomId = myRoom;
        me.room = roomId;
    });

    socket.on('mountainDewPos', function(data){
        dewX = data.x;
        dewY = data.y;
    });

    socket.on('mountainDew', function(data){
        console.log(data.uid);
        console.log(otherPlayers);
        otherPlayers[data.uid].velocity+=10;
    });
});
