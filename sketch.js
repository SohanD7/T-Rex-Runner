var ground, ground_image;
var trex,trex_running;
var platform;
var cloud, clouds;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, cacti;
var score = 0, highScore= 0;
var gameState  = "play";
var trex_stop;
var restart_img, gameOver_img;
var die_sound, jump_sound, checkpoint_sound;

function preload()
{
  trex_running = loadAnimation("trex3.png","trex4.png");  
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_stop = loadAnimation("trex_collided.png");
  restart_img = loadImage("restart.png");
  gameOver_img = loadImage("gameOver.png");
  die_sound = loadSound("die.mp3");
  jump_sound = loadSound("jump.mp3");
  checkpoint_sound = loadSound("checkPoint.mp3");
}

function createCloud()
{
  if (frameCount % 75 == 0)
  {
    cloud = createSprite(550,50,50,10);
    cloud.addImage(cloud_image);
    cloud.scale = 0.6;
    cloud.y = random(10,120);
    cloud.velocityX = random(-3,-4);
    //assign lifetime to the cloud
    cloud.lifetime = 200;
    //adjusting the depth
    cloud.depth = trex.depth - 1;
    clouds.add(cloud);
  }
}

function createCactus()
{
  if (frameCount % 80 == 0)
  {
    cactus = createSprite(550,170,5,30);
    cactus.velocityX = -(4 + score/100);
    var r = Math.round(random(1,6));
    switch(r)
    {
      case 1:
        cactus.addImage(obstacle1);
        cactus.scale = 0.5;
        break
      case 2:
        cactus.addImage(obstacle2);
        cactus.scale = 0.6;
        break
      case 3:
        cactus.addImage(obstacle3);
        cactus.scale = 0.6;
        break
      case 4:
        cactus.addImage(obstacle4);
        cactus.scale = 0.5;
        break
      case 5:
        cactus.addImage(obstacle5);
        cactus.scale = 0.5;
        break
      case 6:
        cactus.addImage(obstacle6);
        cactus.scale = 0.5;
        break
      default:
        break
    }
    cactus.lifetime = 150;
    cacti.add(cactus);
  }
}


function setup(){
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,190,10,10);
  trex.addAnimation("run",trex_running);
  trex.addAnimation("stop",trex_stop);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("circle",0,0,45);

  ground = createSprite(300,180,600,5);
  ground.addImage(ground_image);
  platform = createSprite(300,190,600,0.0001);

  clouds = createGroup();
  cacti = createGroup();

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOver_img);
  gameOver.scale = 0.6;
  restart = createSprite(300,140);
  restart.addImage(restart_img);
  restart.scale = 0.4;
}

function reset()
{
  gameState = "play";
  score = 0;
  cacti.destroyEach();
  clouds.destroyEach();
  trex.changeAnimation("run");
}

function draw()
{
  background("steelblue")
  fill ("white");
  text("Score: "+score,50,30);
  text("High Score: "+highScore,470,30)
  if (gameState == "play")
  {
    ground.velocityX = -5;
    if (ground.x == 0)
    {
      ground.x = 300;
    }
    if (frameCount % 2 == 0)
    {
      score++;
    }
    if (score % 200 == 0 && score > 0)
    {
      checkpoint_sound.play();
    }
    //if (trex.y == 166.99995 || trex.y == 166.74995)
    if (keyDown("space") && trex.collide(ground))
    {
      trex.velocityY = -10;
      jump_sound.play();
    }
    trex.velocityY += 0.5;
    createCloud();
    createCactus();
    if (trex.isTouching(cacti))
    {
      die_sound.play();
      gameState = "end";
    }
    restart.visible = false;
    gameOver.visible = false;
  }
  if (gameState == "end")
  {
    ground.velocityX = 0;
    trex.changeAnimation("stop");
    clouds.setVelocityXEach(0);
    cacti.setVelocityXEach(0);
    clouds.setLifetimeEach(-1);
    cacti.setLifetimeEach(-1);
    trex.velocityY = 0;
    restart.visible = true;
    gameOver.visible = true;
    if (highScore < score)
    {
      highScore = score;
    }
    if (mousePressedOver(restart))
    {
      reset();
    }
  }
  trex.collide(platform);
  drawSprites();
}
