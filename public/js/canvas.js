$(document).ready(function(){
    //socket object
    var socket; 
    var canvas,ctx,me; 
    var dew = [];
    function init(){
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
        me = new Square(10,10,35,35,"#123",10); 
        me.draw();
        generateMountainDew();
        socket = io();
    }
    
    function random(low,high){
        return Math.floor(Math.random()*(high-low)+low);
    }

    function generateMountainDew(){
        for(var i =0;i<2;i++){
            var randomX = random(0,500); 
            var randomY = random(0,500);
            dew.push(new Square(randomX,randomY,10,10,"#6fe63a",0)); 
            dew[i].draw();
        }
    }
    
        
    function Square(x,y,width,height,color,velocity){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.color = color;
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
        } 
    }
    Square.prototype.moveLeft = function(){
        if(this.x>0){
            this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.x = this.x-this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
        } 
    }
    Square.prototype.moveRight = function(){
        if(this.x+this.width<500){
            this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.x = this.x+this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }
    }
    Square.prototype.moveDown = function(){
        if(this.y+this.height<500){
            this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.y = this.y+this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
        } 
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
    });
});
