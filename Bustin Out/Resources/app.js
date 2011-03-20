// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//create the window
var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#000'
});

//these are the hex colours we'll use for our blocks
var colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'];

//this array will hold all our block objects
var blocks = [];

//these are the objects we need access to during the loop, our paddle and ball
var paddle;
var ball;
var lblScore;

//these are the game variables
var speed = 5; //1 px per millisecond
var xVelocity = Math.cos(speed) * speed;
var yVelocity = Math.sin(speed) * speed;
var isComplete = false;
var isPlaying = false;
var score = 0;
var intervalHandle;
var blockCount = 80;



//this function will test whether our ball intersects with our paddle or
//alternatively a block... it checks the intersection of two rectangles
function rectIntersects(rect1,rect2)
{
  var x0 = Math.max(rect1.left, rect2.left);
  var x1 = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
  
  //you can use these commented out info logging lines to check whether
  //the two rectangle properties are valid
  //Ti.API.info('x0 = ' + x0 + ' & x1 = ' + x1);
  //Ti.API.info(rect1.top + ' / ' + rect2.top);

  if (x0 <= x1) {
    var y0 = Math.max(rect1.top, rect2.top);
    var y1 = Math.min(rect1.top + rect1.height, rect2.top + rect2.height);
    
    //checking the values of y0 and y1
    //Ti.API.info('y0 = ' + y0 + ' & y1 = ' + y1);

    if (y0 <= y1) {
      return true;
    }
  }
  return false;
}

//sets the score label to a padded number so its always 6 digits long
function setScoreLabel(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    lblScore.text = str;
}

//this function creates our paddle, blocks and bouncy ball
function createLevel()
{
 //for each row in the top 1/3 of our block area, after we have left a 
 //gap so the ball could bang around the top of the screen
 for(var y = 3; y <= 13; y++)
 {
  //choose a random color for this row of blocks
  var randomColor = colors[Math.floor(Math.random() * colors.length)];
    
  //for each 40px * 16px block in that row (8 blocks p/row)
  for(var x = 0; x < 8; x++)
  { 
    var block = Titanium.UI.createView({
        visible: true,
        width: 40,
        height: 16,
        backgroundColor: randomColor,
        top: (y * 16),
        left: (x * 40)
    });
    
    //add the block to the array of blocks
    blocks.push(block);
    
    //add our block to the window
    win1.add(block);
  }
 } 
 
//this label will hold the score
lblScore = Titanium.UI.createLabel({
    text: '000000',
    right: 5,
    height: 25,
    width: 150,
    textAlign: 'right',
    top: 10,
    color: '#fff',
    font: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Courier, Arial, Verdana'}
});
win1.add(lblScore);

 
 //now instantiate the paddle
 paddle = Titanium.UI.createView({
    width: 50,
    height: 2,
    top: 440,
    left: 145,
    backgroundColor: '#fff'
 });
 
 //and add the paddle to our window
 win1.add(paddle);
 
 //and now instantiate the ball
 ball = Titanium.UI.createView({
    top: 429,
    left: 160,
    width: 10,
    height: 10,
    backgroundColor: '#fff'
 });
 
 //finally, add the ball to the window
 win1.add(ball);
}

//this is called every x milliseconds
function gameLoop()
{
 if(isPlaying)
 {
    ball.left = ball.left + xVelocity;
    ball.top = ball.top + yVelocity;
    
    //Ti.API.info('ball left,top' + ball.left + ', ' + ball.top);
    
    //first we check to see if the ball has hit top, left or right walls
    if(ball.top < 0) {
      ball.top = 0;
      yVelocity = -yVelocity; 
      //Ti.API.info('Hit TOP: yVelocity = ' + yVelocity + ' and xVelocity = ' + xVelocity);
    }
    
    if(ball.left < 0){
      ball.left = 0; 
      xVelocity = -xVelocity;
      //Ti.API.info('Hit LEFT: yVelocity = ' + yVelocity + ' and xVelocity = ' + xVelocity);
    }
    
    if(ball.left + ball.width > 320) {
      ball.left = 320 - ball.width;
      xVelocity = -xVelocity;
     // Ti.API.info('Hit RIGHT: yVelocity = ' + yVelocity + ' and xVelocity = ' + xVelocity);
    }
    
    //then check the bottom wall, this causes the game to throw an epicfail
    //in other words, you lost
    if(ball.top + ball.height > 480) {
     isComplete = false; //you lost
     isPlaying = false;
     clearInterval(intervalHandle);
     alert('You lose :(');
    }
    
    
    
    //then we check if the rectangle is intersecting between paddle and ball
    if(ball.top + ball.height > 439)
    {
        if(rectIntersects(paddle, ball) == true)
        {
            //Ti.API.info('rectangle intersection between paddle and ball discovered');
            ball.top = paddle.top - ball.height;
            yVelocity = -yVelocity;
        }
    }
    
    
     //it doesn't intersect the paddle, so check if it intersects any of the blocks
     //we are testing if the top value is below or equal to 220px (our lowest block)
     if(ball.top <= 220)
     { 
      for(var b = 0; b < blocks.length; b++)
      {
        if(rectIntersects(blocks[b], ball) == true && blocks[b].visible == true)
        {
          //if it intersects a block and that block is still visible then destroy it
          //and give the user some points!
          score = score + 100;
          setScoreLabel(score, 6);
          blocks[b].visible = false;
          blockCount--;
          
          //now reset the ball direction
          if(ball.left + 10 < blocks[b].left || ball.left > blocks[b].left + blocks[b].width){
            xVelocity = -xVelocity;
          } 
          else {
            yVelocity = -yVelocity;
          }
        }
      }
     }
    
    //check to see if we have completed the level
    if(blockCount == 0) {
      isComplete = true; //you won
      isPlaying = false;
      clearInterval(intervalHandle);
      alert('you won!');
    }
     
 } //isPlaying end if
}


//this function starts our game loop and keeps track of the score
//the ball, and the objects we have destroyed, and whether the level
//is still playing or has completed (due to #epicfail or #megawin)
function playGame()
{
   //set the flag to say we're now playing the game
   isPlaying = true;
   
   //initially the ball will travel up from the paddle
   yVelocity = -yVelocity;
   
   //now start the loop, 60 fps is enough for this game
   intervalHandle = setInterval(gameLoop, 17); //1000ms/60 = 16.666
}


//create the button to start the game play!
var buttonPlay = Titanium.UI.createButton({
   title: 'Start Game!',
   width: 200,
   height: 50,
   left: 60,
   top: 220
});
//on button tap, create the level and play the game loop (playGame)
buttonPlay.addEventListener('click', function(e){
  createLevel();
  playGame();
  
  //turn off our menu buttons
  buttonPlay.visible = false;
});
win1.add(buttonPlay);

//add the touch events for the paddle
win1.addEventListener('touchstart', function(e){
    if(isPlaying) {
        //Ti.API.info('touch start fired');
        paddle.left = e.x - (paddle.width /2);
    }
});
win1.addEventListener('touchmove', function(e){
    if(isPlaying) {
       //Ti.API.info('touch move fired');
       paddle.left = e.x - (paddle.width /2);
    }
});


//finally, open our window
win1.open();