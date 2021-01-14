let count = 0;
let para = document.querySelector('p');
// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//生成随机颜色值的函数
function randomColor() {
  return 'rgb('+
      random(0,255)+','+
      random(0,255)+','+
      random(0,255)+')';
}
function Shape(x,y,velX,velY,exists) {
  this.x=x; //最开始时候的坐标
  this.y=y;
  this.velX = velX; //水平和垂直速度
  this.velY = velY;
  this.exists = exists;
}
// 定义 Ball 构造器，继承自 Shape
function Ball(x,y,velX,velY,exists,color,size) {
   Shape.call(this,x,y,velX,velY,exists);
   this.color = color;
   this.size =size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// 定义彩球绘制函数
Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
  ctx.fill();
}

// 定义彩球更新函数
Ball.prototype.update = function () {
  if((this.x +this.size)>width){
    this.velX = -(this.velX);
  }
  if((this.x -this.size) <= 0){
    this.velX = -(this.velX);
  }
  if((this.y +this.size)>height){
    this.velY = -(this.velY);
  }
  if((this.y -this.size) <= 0){
    this.velY = -(this.velY);
  }
  this.x += this.velX;
  this.y +=this.velY;
}
//碰撞检查
Ball.prototype.collisionDetect = function () {
  for(let j = 0; j < balls.length;j++){
    if(this !== balls[j]){
      const dx =this.x -balls[j].x;
      const dy =this.y -balls[j].y;
      const distance = Math.sqrt(dx*dx +dy*dy);

      if(distance <this.size +balls[j].size){
        balls[j].color = this.color = randomColor();
      }
    }
  }
}
//定义一个恶魔球，当其他小球与其相撞时，会消失，同时屏幕上的计数器会减少一
function EvilCircle(x,y,velX,velY,exists) {
  Shape.call(this,x,y,20,20,exists);
  this.color = "white";
  this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor=EvilCircle;

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle=this.color;
  ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
  ctx.stroke();
}

// 定义 EvilCircle 的边缘检测（checkBounds）方法
EvilCircle.prototype.checkBounds = function () {
  if((this.x +this.size)>=width){
    this.x -= this.size;
  }
  if((this.x -this.size) <= 0){
    this.x += this.size ;
  }
  if((this.y +this.size)>=height){
    this.y -= this.size;
  }
  if((this.y -this.size) <= 0){
    this.y += this.size;
  }
}

EvilCircle.prototype.setControls = function () {
  window.onkeydown = e => {
    switch(e.key) {
      case 'a':
        this.x -= this.velX;
        break;
      case 'd':
        this.x += this.velX;
        break;
      case 'w':
        this.y -= this.velY;
        break;
      case 's':
        this.y += this.velY;
        break;
    }
  }
}

// 定义 EvilCircle 冲突检测函数
EvilCircle.prototype.collisionDetect = function () {
  for(let j = 0; j < balls.length;j++){
    if(balls[j].exists ){
      const dx =this.x -balls[j].x;
      const dy =this.y -balls[j].y;
      const distance = Math.sqrt(dx*dx +dy*dy);

      if(distance <this.size +balls[j].size){
        balls[j].exists = false;
        count--;
        para.textContent = '剩余彩球数：' + count;
      }
    }
  }
}

let balls =[];
let evilcircle = new EvilCircle(random(0,width),random(0,height),true);
evilcircle.setControls();

while (balls.length <25){
  let size = random(10,20);
  let ball = new Ball(
      //为了避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
      random(0+size,width-size),
      random(0+size,height-size),
      random(-7,7),
      random(-7,7),
      true,
      randomColor(),
      size
  );
  balls.push(ball);
  count++;
  para.textContent = '剩余彩球数：' + count;
}
//动画效果常用到一个运动循环，也就是每一帧都自动更新视图
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; //在下一个视图画出来之前遮住之前的视图
  ctx.fillRect(0,0,width,height);

  for(let i = 0;i < balls.length;i++){
    if (balls[i].exists == true){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();

    }
  }
  evilcircle.draw();
  evilcircle.checkBounds();
  evilcircle.collisionDetect();
  requestAnimationFrame(loop);
}

loop();


