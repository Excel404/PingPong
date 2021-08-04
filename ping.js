const canvas = document.getElementById('canvas');
console.log( window.innerHeight);
console.log( window.innerWidth);
const context = canvas.getContext('2d');
let text;
//draw Rectangle (i.e canvas and paddles)
function drawRect(x,y,w,h,color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}
// draw circle(i e ball)
function drawCircle(x, y, r, color){
    context.fillStyle= color;
    context.beginPath();
    context.arc( x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}
// draws Text ( score)
function drawText(score, x, y,color){
    context.fillStyle = color;
    context.font = '40px sans-serif';
    context.fillText(score, x, y);
}
const user= {
    x : 0,
    y : canvas.height/2 - 50,
    w: 10,
    h: 50,
    score: 0
}
const comp= {
    x : canvas.width - 10,
    y : canvas.height/2 - 50,
    w: 10,
    h: 50,
    score: 0
}
const net = {
    x: canvas.width/2 -1,
    y: 0,
    w: 2,
    h: 10
}
const ball ={
    x: canvas.width/2,
    y: canvas.height/2,
    r: 10,
    speed : 5,
    Vx : 5,
    Vy : 5
}
canvas.addEventListener("mousemove", movePaddle);
function movePaddle(event){
  let rect = canvas.getBoundingClientRect();
  
  user.y = event.clientY - rect.top - user.h/2;
}
function drawNet(){
    for(i=0; i< canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.w, net.h, 'white');//draws net
    }
}
function show(){
  drawRect(0,0,window.innerHeight, window.innerWidth,'black');//draws canvas
    drawText( user.score, canvas.width/4, canvas.height/5, 'white');//draws user's score
    drawText( comp.score, 3*canvas.width/4, canvas.height/5, 'white');//draws conputer's score
    drawRect(user.x, user.y, user.w, user.h, 'white');//draws user's paddle
    drawRect(comp.x, comp.y, comp.w, comp.h, 'white');//draws computer's paddle
    drawNet()//draws net
    drawCircle(ball.x, ball.y, ball.r, 'white');//draws ball
}
function game(){
    update();
    show()//displays the drawn items
}

function collision(ball, player){
  //checks for collision
    ball.top = ball.y - ball.r;
    ball.bottom = ball.y + ball.r
    ball.left = ball.x - ball.r;
    ball.right = ball.x + ball.r;
    
    player.top = player.y;
    player.bottom = player.y + player.h;
    player.left = player.x ;
    player.right = player.x + player.w;

    return ball.top < player.bottom && ball.bottom > player.top && ball.left < player.right && ball.right > player.left;
}
function update(){
    ball.x += ball.Vx;
    ball.y += ball.Vy;
    totalY = ball.y + ball.r;
    totalX = ball.x + ball.r;
    let level = 0.1;

    comp.y += (ball.y- (comp.y + comp.h/2))* level;//A simple AI used to move the computer's paddle
    let player = (ball.x <canvas.width/2)? user: comp;//sets the player to be the user if the condition is true otherwise the computer
    
    if(collision (ball,player)){
        //checks if the ball collided with any of the paddle and the point it collided
        let collidePoint = (ball.y -(player.y + player.h/2))/player.h/2;
        let angleRad = collidePoint * (Math.PI/4);//gets the angle of collision by multiplying the normalised collided point by 45 degrees
        let direction= (ball.x< canvas.width/2)? 1 : -1;//changes the direction of the ball as it hits the paddle
        ball.Vx = direction*ball.speed * Math.cos(angleRad);//changes the VelocityX
        ball.Vy = direction*ball.speed * Math.sin(angleRad);//changes the velocityY
        ball.speed += 0.1;//increases the speed of the ball on every collision
    }
    
    if(ball.x < canvas.width/2){// checks if the ball is in the user's half
        if(totalY > canvas.height|| ball.y - ball.r < 0){
            ball.Vy = - ball.Vy;//reverts the velocityY as soon as the ball touches the upper or lower boundaries
        }
        if(ball.x - ball.r < 0){
            comp.score ++;//Increments the computer score if the ball crosses the left boundary
            resetBall();//resets the ball position, velocity and speed
        }
       
    }
    if(ball.x > canvas.width/2){
        if(totalY > canvas.height|| ball.y - ball.r < 0){
            ball.Vy = - ball.Vy;
        }
        if(totalX > canvas.width){
          user.score ++;
          resetBall()//resets the ball position, velocity and speed
        }
    }
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.Vx = - ball.Vx;
}
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond)//implements the function 'game' 50 times in a sscond
