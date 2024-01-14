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

class Spike extends Sprite {
  constructor(x, y, width, height) {
    super(x, y, width, height, 'static');
    this.img = loadImage('spike.png'); // Load the image
  }

  display() {
    // Use the image function to draw the spike image
    image(this.img, this.position.x, this.position.y, this.width, this.height);
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
let spikeImage;

let spikeWidth = 250; // Adjust width based on your requirements
let spikeHeight = 180; // Adjust height based on your requirements

let blockData = {
  "blocks": [
    { "x": 0, "y": 200 },
    { "x": 150, "y": 250 },
    { "x": 200, "y": 300 },
    { "x": 250, "y": 550 },
    { "x": 200, "y": 500 }
  ],
  "spikes": [
    { "x": 150, "y": 400 },
    { "x": 250, "y": 450 }
  ]
};

function createBlock(x, y, width, height) {
  let block = new Sprite(x, y, width, height, 'static');
  block.shapeColor = color(0);
  block.immovable = true;
  return block;
}

function preload() {
  // Load spike image in the preload function with callbacks
  spikeImage = loadImage('spike.png', imgLoaded, imgError);
}

function imgLoaded(img) {
  console.log('Image loaded successfully:', img);
}

function imgError(err) {
  console.error('Error loading image:', err);
}

function setup() {
  createCanvas(400, 400);
  ball = new Ball(width / 2, 50, 20);
  ball.shapeColor = color(255);

  // Create blocks using data from JSON
  for (let i = 0; i < blockData.blocks.length; i++) {
    let block = createBlock(blockData.blocks[i].x, blockData.blocks[i].y, 100, 15);
    blocks.push(block);
  }
}

function draw() {
  background(220);

  // Move blocks up gradually
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].moveUp(0.5);
    blocks[i].display();
  }

  // Draw the spike image for each spike once it's loaded
  if (spikeImage) {
    for (let i = 0; i < blockData.spikes.length; i++) {
      image(spikeImage, blockData.spikes[i].x, blockData.spikes[i].y, spikeWidth, spikeHeight);
    }
  }

  // Move the ball based on user input
  if (keyIsDown(LEFT_ARROW) && ball.position.x > 25) {
    ball.position.x -= 5;
  }
  if (keyIsDown(RIGHT_ARROW) && ball.position.x < width - 25) {
    ball.position.x += 5;
  }

  // Gravity for the ball
  ball.position.y += 2;

  // Check collisions with blocks
  for (let i = 0; i < blocks.length; i++) {
    if (ball.collide(blocks[i])) {
      ball.position.y = blocks[i].position.y - ball.height / 2;
      ball.velocity.y = 0; // Stop the ball from moving vertically
    }
  }

  // Check collisions with spikes
  for (let i = 0; i < blockData.spikes.length; i++) {
    if (ball.collide(blockData.spikes[i])) {
      // Ball hits a spike, respawn the ball
      ball.position.x = width / 2;
      ball.position.y = 50;
    }
  }

  // Display the ball
  ball.display();
}
