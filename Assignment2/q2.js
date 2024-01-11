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
      return (
        this.position.x < other.position.x + other.width &&
        this.position.x + this.width > other.position.x &&
        this.position.y < other.position.y + other.height &&
        this.position.y + this.height > other.position.y
      );
    }
  }
  
  let ball;
  let blocks = [];
  let spikes = [];
  let blockData = {
    "blocks": [
      { "x": 100, "y": 200 },
      { "x": 200, "y": 200 },
      { "x": 300, "y": 200 }
    ],
    "spikes": [
      { "x": 150, "y": 400 },
      { "x": 250, "y": 400 }
    ]
  };
  
  function createBlock(x, y, width, height) {
    let block = new Sprite(x, y, width, height, 'static');
    block.shapeColor = color(0, 255, 0);
    block.immovable = true; // Make the block immovable
    return block;
  }
  
  function setup() {
    createCanvas(400, 400);
    ball = new Sprite(width / 2, 50, 20, 20);
    ball.shapeColor = color(255);
  
    // Create blocks using data from JSON
    for (let i = 0; i < blockData.blocks.length; i++) {
      let block = createBlock(blockData.blocks[i].x, blockData.blocks[i].y, 50, 20);
      blocks.push(block);
    }
  
    // Create spikes using data from JSON
    for (let i = 0; i < blockData.spikes.length; i++) {
      let spike = new Sprite(blockData.spikes[i].x, blockData.spikes[i].y, 30, 30);
      spike.shapeColor = color(255, 0, 0);
      spikes.push(spike);
    }
  }
  
  function draw() {
    background(220);
  
    // Move blocks and spikes up gradually
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].moveUp(0.5);
      blocks[i].display();
    }
  
    for (let i = 0; i < spikes.length; i++) {
      spikes[i].moveUp(0.5);
      spikes[i].display();
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
    for (let i = 0; i < spikes.length; i++) {
      if (ball.collide(spikes[i])) {
        // Ball hits a spike, respawn the ball
        ball.position.x = width / 2;
        ball.position.y = 50;
      }
    }
  
    // Display the ball
    ball.display();
  }
  