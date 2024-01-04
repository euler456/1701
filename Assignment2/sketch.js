let burgers = [];

function setup() {
  createCanvas(400, 400);
  noStroke();

  // Create four burgers and initialize their properties at the center
  for (let i = 0; i < 4; i++) {
    burgers.push(new Burger());
  }
}

function draw() {
  background(255);

  // Draw the no-crossing area on the left
  fill(200, 0, 0); // Red color for illustration
  rect(0, 0, 75, height);

  // Update and draw each burger
  for (let i = 0; i < burgers.length; i++) {
    let burger = burgers[i];
    burger.update();
    burger.display();
  }
}

class Burger {
  constructor() {
    this.breadWidth = 45;
    this.breadHeight = 35;
    this.pattyWidth = 70;
    this.pattyHeight = 8;
    this.borderWeight = 1;
    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector(random(-3, 3), random(-3, 3));
  }

  update() {
    // Prevent the burger from crossing into the no-crossing area on the left
    if (this.position.x - this.breadWidth / 2 < 75) {
      this.velocity.x = abs(this.velocity.x); // Reverse direction
    }

    // Bounce the burger off the walls
    if (
      this.position.x - this.breadWidth / 2 < 0 ||
      this.position.x + this.breadWidth / 2 > width ||
      this.position.x - this.pattyWidth / 2 < 0 ||
      this.position.x + this.pattyWidth / 2 > width
    ) {
      this.velocity.x *= -1;
    }

    // Bounce the burger off the top and bottom
    if (
      this.position.y - this.breadHeight / 2 < 0 ||
      this.position.y + this.breadHeight / 2 > height ||
      this.position.y - this.pattyHeight / 2 < 0 ||
      this.position.y + this.pattyHeight / 2 > height
    ) {
      this.velocity.y *= -1;
    }

    // Update the burger's position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  display() {
    // Draw the white bread layers
    fill(255); // White bread layers
    rectMode(CENTER);
    rect(this.position.x, this.position.y, this.breadWidth, this.breadHeight, 5);

    // Draw the black border for the bread layers
    noFill();
    stroke(0);
    strokeWeight(this.borderWeight);
    rect(this.position.x, this.position.y, this.breadWidth, this.breadHeight, 5);

    // Reset stroke settings
    noStroke();

    // Draw the burger layers
    fill(0); // Black patty
    rect(this.position.x, this.position.y, this.pattyWidth, this.pattyHeight);
  }
}
