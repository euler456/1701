let ball;
let square;

function setup() {
  createCanvas(400, 400);
  ball = createSprite(width / 2, height / 2, 20, 20);
  ball.velocity.x = 3; // Initial velocity in the x direction
  ball.velocity.y = 2; // Initial velocity in the y direction

  square = createSprite(width / 2, height / 2, 100, 100);
  square.immovable = true; // Make the square immovable
}

function draw() {
  background(220);

  // Bounce the ball off the edges of the canvas
  if (ball.position.x < 0 || ball.position.x > width) {
    ball.velocity.x *= -1;
  }
  if (ball.position.y < 0 || ball.position.y > height) {
    ball.velocity.y *= -1;
  }

  // Bounce the ball off the square
  ball.bounce(square);

  // Update the ball and square positions
  drawSprites();
}
