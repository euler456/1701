class Sprite {
  constructor(x, y, width, height, type = 'dynamic') {
    this.position = createVector(x, y);
    this.width = width;
    this.height = height;
    this.velocity = createVector(0, 0);
    this.type = type;
    this.shapeColor = color(255);
    this.immovable = false;
  }

  moveUp(speed) {
    this.position.y -= speed;
  }

  display() {
    fill(this.shapeColor);
    rect(this.position.x, this.position.y, this.width, this.height);
  }

  collide(other) {
    if (other && other.position) {
      return (
        this.position.x < other.position.x + other.width &&
        this.position.x + this.width > other.position.x &&
        this.position.y < other.position.y + other.height &&
        this.position.y + this.height > other.position.y
      );
    }
    return false;
  }
}
class Heart extends Sprite {
  constructor(x, y, width, height) {
    super(x, y, width, height, 'dynamic');
    this.image = loadImage('heart.png');
    this.collected = false;
  }

  collect() {
    if (!this.collected) {
      this.collected = true;
      lives++;
    }
  }

  display() {
    if (!this.collected) {
      image(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  }
}
class Spike {
  constructor(x, y, width, height) {
    this.position = createVector(x, y);
    this.width = width;
    this.height = height;
    this.image = loadImage('spike.png');
  }

  moveUp(speed) {
    this.position.y -= speed;
  }
  display() {
    image(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}

class Ball extends Sprite {
  constructor(x, y, diameter) {
    super(x, y, diameter, diameter, 'dynamic');
  }

  display() {
    fill(this.shapeColor);
    ellipse(this.position.x, this.position.y, this.width, this.height);
  }
}

let ball;
let blocks = [];
let spikes = [];
let lives = 5;
let spikeWidth = 100; 
let spikeHeight = 20; 
let score = 0; 
let ballContactingBlock = false;
let hearts = [];
let heartWidth = 30;
let heartHeight = 30;

function createHeart(x, y, width, height) {
  let heart = new Heart(x, y, width, height);
  heart.shapeColor = color(255);
  return heart;
}
function preload() {
  blockData = loadJSON('blocks.json');
  TopspikeImage = loadImage('upsidedownspike.png');
}
function createBlock(x, y, width, height) {
  let block = new Sprite(x, y, width, height, 'static');
  block.shapeColor = color(0);
  block.immovable = true;
  return block;
}

function createSpike(x, y, width, height) {
  let spike = new Spike(x, y, width, height);
  spike.shapeColor = color(255);
  return spike;
}

function respawnBall() {
  if (lives > 0) {
    lives--;
    ball.position.x = width / 2;
    ball.position.y = 50;
    ball.velocity.y = 0;

    console.log("Lives remaining: " + lives);
  } else {
    console.log("Game Over");
    lives = 3;
    score = 0;
  }
}
function setup() {
  createCanvas(400, 400);
  ball = new Ball(width / 2, 50, 20);
  ball.shapeColor = color(255);

  for (let i = 0; i < blockData.blocks.length; i++) {
    let block = createBlock(blockData.blocks[i].x, blockData.blocks[i].y, 100, 15);
    blocks.push(block);
  }

  for (let i = 0; i < blockData.spikes.length; i++) {
    let spike = createSpike(blockData.spikes[i].x, blockData.spikes[i].y, spikeWidth, spikeHeight);
    spikes.push(spike);
  }
  for (let i = 0; i < 3; i++) { // Adjust the number of hearts as needed
    let heart = createHeart(blockData.heart[i].x, blockData.heart[i].y, heartWidth, heartHeight);
    hearts.push(heart);
  }
}


let lastBallY = 0; // Variable to store the last known Y position of the ball

function draw() {
  background(200);
  fill(0);
  textSize(16);
  text("Score: " + score, 10, 20);
  text("Lives: " + lives, 10, 40);

  // Display top spikes
  for (let i = 0; i < 4; i++) {
    image(TopspikeImage, i * 100, 0, 100, 10);
  }

  // Display blocks and move them up
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].moveUp(0.3);
    blocks[i].display();
  }

  // Display spikes and move them up
  for (let i = 0; i < spikes.length; i++) {
    spikes[i].moveUp(0.3);
    spikes[i].display();
  }

  if (keyIsDown(LEFT_ARROW) && ball.position.x > 25) {
    ball.position.x -= 5;
  }
  if (keyIsDown(RIGHT_ARROW) && ball.position.x < width - 25) {
    ball.position.x += 5;
  }

  ball.position.y += 2;

  for (let i = 0; i < blocks.length; i++) {
    if (ball.collide(blocks[i])) {
      ball.position.y = blocks[i].position.y - ball.height / 2;
      ball.velocity.y = 0;
    }
  }

  for (let i = 0; i < spikes.length; i++) {
    if (ball.collide(spikes[i])) {
      respawnBall();
    }
  }

  for (let i = 0; i < 4; i++) {
    let topSpike = createSpike(i * 100, 0, 100, 10);
    if (ball.collide(topSpike)) {
      respawnBall();
    }
  }
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].moveUp(0.3);
    hearts[i].display();

    if (ball.collide(hearts[i])) {
      hearts[i].collect();
    }
  }
  if (ball.position.y > lastBallY) {
    score += int((ball.position.y - lastBallY) / 2);
  }
  lastBallY = ball.position.y;

  if (ball.position.y > height) {
    respawnBall();
  }

  ball.display();
}