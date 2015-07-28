window.onload = function() {
  
    //creating the canvas
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");
    var score = 0, 
        level = 0,
        direction = 0,
        snake = new Array(3),
        active = true,
        speed = 500 ;
    
    //intialize game map i.e 20x20 matrix 
    var map = new Array(20);
    for(var i = 0; i <map.length; i++) {
        map[i] = new Array(20);
    }
    
    //define canvas height and width, 4 extra for boundary
    canvas.height = 224;
    canvas.width = 204;
    
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
    
    generateSnake(map);
    generateFood(map);
    drawGame();
    
    //adding evenlistner for keys
     window.addEventListener('keydown', function(e) {
        if (e.keyCode === 38 && direction !== 3) {
            direction = 2; // Up
        } else if (e.keyCode === 40 && direction !== 2) {
            direction = 3; // Down
        } else if (e.keyCode === 37 && direction !== 0) {
            direction = 1; // Left
        } else if (e.keyCode === 39 && direction !== 1) {
            direction = 0; // Right
        }
    });
    
    function drawGame() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        //for loop to traverse the snake body to perform various functions
        for (var i = snake.length -1; i >= 0; i--) {
            //setting the head of the snake body for directions of the snake
            if (i === 0) {
                switch(direction) {
                    case 0:
                        snake[0] = { x : snake[0].x + 1, y : snake[0].y }
                        break;
                    case 1:
                        snake[0] = { x : snake[0].x - 1, y : snake[0].y }
                        break;
                    case 2:
                        snake[0] = { x : snake[0].x, y : snake[0].y - 1 }
                        break;
                    case 3:
                        snake[0] = { x : snake[0].x, y : snake[0].y + 1 }
                        break;
                        
                }
            
            
            //check the bounds of snake
            if (snake[0].x < 0 ||
                snake[0].x > 20 ||
                snake[0].y < 0 ||
                snake[0].y > 20 ) {
                gameOver();
                return;
            }
        
            //Detect the collision of snake with food and hence increase score, snake size and level
            if (map[snake[0].x][snake[0].y] === 1) {
                //increase the score by 10 and generate food again
                score += 10;
                map = generateFood(map);
                
                //increase the length of snake by adding new piece to the end of snake body
                snake.push({ x : snake[snake.length - 1].x, y : snake[snake.length - 1].y});
                map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;
                
                //increasing the level if score is in multiple of 100
                if((score % 100) === 0) {
                    level += 1;
                }
            //Now we need to check if the snake is hitting iself or not    
            } else if (map[snake[0].x][snake[0].y] === 2) {
                gameOver();
                return;
            }
            
            //make the new position of head as 2 in the map
            map[snake[0].x][snake[0].y] = 2 ;
          } else {
            //if the body piece is last then make it null to move
              if (i === snake.length - 1) {
                map[snake[i].x][snake[i].y] = null;
              }
              
              //move the snake by moving the body pieces
              snake[i] = {x : snake[i - 1].x, y : snake[i - 1].y}
              map[snake[i].x][snake[i].y] = 2;
            }
        }
        
        //calling main draw function
        drawMain();
        
        //Cycling the matrix of map i.e multiplying rows and columns with pixels - rows*10px and column*10px+20
        for (var i = 0; i < map.length ; i++) {
            for (var j = 0; j < map[0].length ; j++) {
                if (map[i][j] === 1) {
                    context.fillStyle = "black";
                    context.fillRect(i * 10, j * 10 + 20, 10, 10);
                } else if (map[i][j] === 2) {
                    context.fillStyle = "orange";
                    context.fillRect(i * 10, j * 10 + 20, 10, 10);
                }
            }
        }
        
        if (active) {
            setTimeout(drawGame, speed - (level*50));
        }
            
    }
    
    function drawMain() {
        context.lineWidth = 2;
        context.strokeStyle = "orange";
        
        //Drawing the Boundary
        context.strokeRect(2, 20, canvas.width - 4, canvas.height - 24);
        
        //Display Score and Level
        context.font = "12px sans-serif";
        context.fillText('Score: ' + score + ' Level: ' + level, 2, 12); 
    }
    
    //function to generate food
    function generateFood(map) {
        //Generate the food withing map at any random position
        var rndX = Math.round(Math.random() * 19),
            rndY = Math.round(Math.random() * 19) ;
        
        //Avoid the generation of food and snake body at same position
        while (map[rndX][rndY] === 2) {
            rndX = Math.round(Math.random() * 19),
            rndY = Math.round(Math.random() * 19) ;
        }
        
        //mark 1 as food on the map
        map[rndX][rndY] = 1;
        
        return map ;

    }
    
    //function to generate snake
    function generateSnake(map) {
        //Generate the snake withing map at any random position
        var rndX = Math.round(Math.random() * 19),
            rndY = Math.round(Math.random() * 19) ;
        
        //To make space for the snake body, to ensure two empty blocks on left 
        while((rndX - snake.length) < 0) {
            rndX = Math.round(Math.random() * 19);
        }
        
        //to generate snake body from head to left and mark 2 for snake body on map
        for(var i = 0; i < snake.length; i++) {
            snake[i] = { x: rndX - i, y: rndY };
            map[rndX - i][rndY] = 2;
        }
        
        return map ;
    }
    
    //Function to display on game over
    function gameOver() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black' ;
        context.font = '16px sans-serif';
        
        //calculation is done to fixate the text in exact middle position
        context.fillText('GAME OVER !!!', ((canvas.width / 2) - (context.measureText('GAME OVER !!!').width/2)), 50);
        
        context.font = '12px sans-serif';
        context.fillText('SCORE : ' + score, ((canvas.width / 2) - (context.measureText('SCORE : ' + score).width/2)), 70);
        
    }
};