let ball;

function setup() {
  createCanvas(400, 400);
  world.gravity.y = 0;

  ball = new Sprite();
  ball.diameter = 50;
  ball.velocity.x = 3;
  ball.velocity.y = 2;
}

function draw() {
  background(255);

  // Bounce the ball off the walls
  if (ball.position.x - ball.width / 2 < 0 || ball.position.x + ball.width / 2 > width) {
    ball.velocity.x *= -1;
  }

  // Bounce the ball off the top and bottom
  if (ball.position.y - ball.height / 2 < 0 || ball.position.y + ball.height / 2 > height) {
    ball.velocity.y *= -1;
  }

  // Update the ball's position
  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;

  // Keep the ball within the canvas boundaries
  ball.position.x = constrain(ball.position.x, ball.width / 2, width - ball.width / 2);
  ball.position.y = constrain(ball.position.y, ball.height / 2, height - ball.height / 2);

  // Draw the ball
  fill(0, 0, 255);
  ellipse(ball.position.x, ball.position.y, ball.width, ball.height);
}
