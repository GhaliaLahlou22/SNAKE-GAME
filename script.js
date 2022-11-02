window.onload = function(){

  
    var canvasHeight = 600 ; 
    var canvasWidth = 900;
    var blocksize = 30;
    var ctx; 
    var delay = 100;
    var ateApple ; 
    var serpend;
    var pomme ; 
    var widthinblock = canvasWidth/blocksize;
    var heightblock = canvasHeight/blocksize;
    var score ; 
    var timeout ; 



    init();
  

    function init(){
        var  canvas = document.createElement('canvas'); 
        canvas.height=canvasHeight;
        canvas.width = canvasWidth;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        serpend = new Snake([[6,4] ,[5,4] , [4,4], [3,4]] , "right");
        pomme = new Apple([10,10]);
        serpend.advance();
        score = 0 ;
        refreshCanvas();
      
    }

    function refreshCanvas(){
        serpend.advance();
        if( serpend.checkColission()){
            //Game Over
            GameOver();
        }else{
            if(serpend.isEating(pomme)){
                // le serpent a mange la pomme 
                serpend.ateApple = true;
                score ++ ; 
                do{
                    pomme.setnewPos();
                }
                while(pomme.isOnSnake(serpend))
                
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            serpend.draw();
            pomme.draw();
            getscore();
           timeout=  setTimeout(refreshCanvas,delay);
        }
        
    }
    function GameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
      
       
        ctx.restore();
    }

    function restart(){
        serpend = new Snake([[6,4] ,[5,4] , [4,4], [3,4]] , "right");
        pomme = new Apple([10,10]);
        score = 0 ; 
        clearTimeout(timeout);
        refreshCanvas();

    }

    function getscore(){
        ctx.save();
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "gray"; 
       
        ctx.fillText(" SCORE : "+score.toString(),15,canvasHeight -5);
        ctx.restore();
    }

    function drawBlock(ctx , pos){
        var x = pos[0]*blocksize;
        var y = pos[1]*blocksize;
        ctx.fillRect(x,y,blocksize,blocksize);
    }
    function Apple(pos){
        this.pos=pos;
        this.draw  = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius =blocksize/2 ; 
            var x = this.pos[0]*blocksize + radius;
            var y =this.pos[1]*blocksize + radius ; 
            ctx.arc(x,y,radius,0,Math.PI*2 , true);
            ctx.fill();
            ctx.restore();
        };
        this.setnewPos = function(){
            var newX  =Math.round( Math.random() * (widthinblock-1));
            var newY  =Math.round( Math.random() * (heightblock-1));
            this.pos = [newX , newY];

        };
        this.isOnSnake = function(snakecheck){
            var isonsnake = false ; 
            for(var i = 0 ; i<snakecheck.body.length ; i++){
                if(this.pos[0] === snakecheck.body[i][0] && this.pos[1] === snakecheck.body[i][1]){
                    isonsnake = true;
                }
            }
            return isonsnake ; 
        };
    }

    function Snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        
        this.draw=function(){
            ctx.save();
            ctx.fillStyle="#ff0000";
            for(var i = 0 ; i<this.body.length ; i++){
                drawBlock(ctx , this.body[i]);
            }

            ctx.restore();
        }; 
        
        this.advance= function(){
            var nextPos = this.body[0].slice();
            switch(this.direction){
                case "left":
                  nextPos[0]--;
                  break;
                case "right":
                  nextPos[0]++;
                  break;
                case "down":
                  nextPos[1]++;
                  break;
                case "up":
                  nextPos[1]--;
                  break;
                default : 
                    throw("invalide direcetion");
            }
            this.body.unshift(nextPos);
          
            if( ! this.ateApple){
                this.body.pop(); 
            }else
                this.ateApple = false ;

    
        };

        this.setDirection = function(newDirection){
            var allowedDirections ; 
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections=["up" , "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections=["left" , "right"];
                    break;
                default:
                    throw("invalide direcetion");
            }
            if(allowedDirections.indexOf(newDirection)>-1 ){
                this.direction = newDirection;
            }
        };
        this.checkColission = function(){
            var wallcol = false ; 
            var snakecol = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX= 0 ;
            var minY = 0 ;
            var maxX = widthinblock-1;
            var maxY = heightblock-1 ;
            var isnotbetweenHorizontalwall = snakeX < minX || snakeX > maxX ;
            var isnotbetweenVerticalwall = snakeY < minY || snakeY > maxY ;

            if(isnotbetweenHorizontalwall ||isnotbetweenVerticalwall){
                wallcol = true ; 
            }
            for(var i = 0 ; i<rest.length ; i++){
                if(snakeX === rest[i][0]  && snakeY === rest[i][1] ){
                    snakecol =true;
                }
            }
            return wallcol || snakecol ;
        };
        this.isEating = function(eatapple){
            var head = this.body[0];
            if(head[0]=== eatapple.pos[0] && head[1]=== eatapple.pos[1])
            {
               return true ;  
            }else{
                return false ; 
            }
        };
    }
    
document.onkeydown = function handleKeyDown(keypressed){
    var key  = keypressed.keyCode;
    var newDirection ;
    switch(key){
        case 37 : 
            newDirection= "left";
            break;
         case 38 : 
            newDirection= "up";
            break;
            
        case 39 : 
            newDirection= "right";
            break;
            
        case 40 : 
            newDirection= "down";
            break;
        case 32 : 
            restart();
            return;
        default : 
            return;   
    }
    serpend.setDirection(newDirection);
}
   
}
