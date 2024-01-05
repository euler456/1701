let burgers = [];
let ralph;

function setup() {
  createCanvas(500, 400);
  noStroke();
  ralph = new Ralph();

  // Create four burgers and initialize their properties at the center
  for (let i = 0; i < 4; i++) {
    burgers.push(new Burger());
  }
}

function draw() {
  background(255);
  // Find the closest burger to Ralph
  let closestBurger = findClosestBurger(ralph, burgers);

  // Handle keyboard input
  if (keyIsDown(UP_ARROW)) {
    ralph.move(-1); // Move Ralph up
  } else if (keyIsDown(DOWN_ARROW)) {
    ralph.move(1); // Move Ralph down
  }

  // Update and draw Ralph
  ralph.update(closestBurger);
  ralph.display();

  // Update and draw each burger
  for (let i = 0; i < burgers.length; i++) {
    let burger = burgers[i];
    burger.update();
    burger.display();
  }
}

// Function to find the closest burger to a given object
function findClosestBurger(object, burgerArray) {
  let closestBurger = null;
  let closestDistance = Infinity;

  for (let i = 0; i < burgerArray.length; i++) {
    let burger = burgerArray[i];
    let distanceX = abs(burger.position.x - object.x); // Calculate only x-axis distance

    if (distanceX < closestDistance) {
      closestDistance = distanceX;
      closestBurger = burger;
    }
  }

  return closestBurger;
}

class Ralph {
  constructor() {
    this.x = width / 4;
    this.y = height / 2;
    this.mouthOpen = false;
    this.mouthHeight = 35; // Initial height of the mouth
    this.closestBurger = 0;
    this.speed = 5; // Speed of Ralph's movement
  }

  move(direction) {
    this.y += this.speed * direction;
  }

  update(closestBurger) {
    if (closestBurger) {
      // Check if the closest burger is close to Ralph's face along the x-axis
      let distanceX = 70 - (closestBurger.position.x - this.x) / 2;
      if (distanceX >= 0) {
        // Adjust the height of the mouth based on the distance
        this.mouthHeight = distanceX ;
        this.closestBurger = closestBurger;
      }
    }
  }

  display() {
    fill(255);
    rect(80, this.y, 110, 130, 10, 10, 0, 0);
    noFill(); // Adding border to the white rectangle
    stroke(0);
    strokeWeight(1);
    rect(80, this.y + 50, 110, 130, 10, 10, 0, 0);
    fill(0);
    rect(80, this.y, 110, 35, 10, 10, 0, 0);
    noFill(); // Adding border to the black rectangle
    stroke(0);
    fill(255);
    triangle(135, this.y + 60, 135, this.y + 90, 155, this.y + 90);
    fill(255);
    // New rectangle with changing Y position
    rect(80, this.y + 195 + (this.mouthHeight - 65), 110, 30, 0, 0, 10, 10);
    noStroke(); // No border for the new rectangle
    fill(255);
    rect(48, this.y + 125, 45, this.mouthHeight + 34);
    // Restore stroke for other shapes
    stroke(0);
    line(70, this.y + 115 + this.mouthHeight, 70, this.y + 115);
    line(25, this.y + 115 + this.mouthHeight, 25, this.y + 115);

    // Eye
    fill(255);
    ellipse(110, this.y + 45, 30, 30);
    fill(0);
    if (this.closestBurger) {
      let angle = atan2(this.closestBurger.position.y - this.y + 10, this.closestBurger.position.x - this.x + 10);
      let eyeX = this.x - 17 + cos(angle) * 8;
      let eyeY = this.y + 45 + sin(angle) * 8; // Adjusted the eye's y position
      ellipse(eyeX, eyeY, 15, 15);
    
    }
  }
}
class Burger {
  constructor() {
    this.breadWidth = 45;
    this.breadHeight = 25;
    this.pattyWidth = 70;
    this.pattyHeight = 8;
    this.borderWeight = 1;
    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
  }

  update() {
    // Check if the burger is in the mouth region
      if (
        this.position.x > 105 &&
        this.position.x < 180 &&
        this.position.y > ralph.y + 125 &&
        this.position.y < ralph.y + 125 + ralph.mouthHeight
      ) {
        // Bounce the burger within the mouth
        this.velocity.y *= -1;
      } else {
        // Burger is outside the mouth, apply regular bouncing logic
  
        // Check if the burger hits the x-coordinate 70, then move it back to the starting position
        if (this.position.x <= 110) {
          this.position.set(width / 2, height / 2);
          this.velocity = createVector(random(-2, 2), random(-2, 2)); // Reset velocity
        }
  
        // Prevent the burger from crossing into the no-crossing area on the left
        if (this.position.x - this.breadWidth / 2 < 150) {
          // Ensure the burger cannot cross the x-axis, but can go into the mouth
          this.position.x = max(this.position.x, 150 + this.breadWidth / 2);
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
