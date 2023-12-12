let ralph;
let burger;

function setup() {
  createCanvas(400, 400);
  ralph = new Ralph();
  burger = new Burger();
}

function draw() {
  background(220);

  burger.update();
  ralph.update(burger);

  burger.display();
  ralph.display();
}

class Ralph {
  constructor() {
    this.x = width / 4;
    this.y = height / 2;
    this.mouthOpen = false;
    this.mouthHeight = 35; // Initial height of the mouth
  }

  update(burger) {
    // Check if the burger is close to Ralph's face along the x-axis
    let distanceX = abs(burger.x - this.x );
    this.mouthOpen = distanceX < 50; // Adjust the threshold as needed

    // Adjust the height of the mouth based on the distance
    this.mouthHeight = map((distanceX/2), 60, 30, 50, 60);
  }

display() {
    fill(255);
    rect(10, 40, 110, 130, 10);
    fill(0);
    rect(10, 40, 110, 35, 10, 10, 0, 0);
    fill(255);
    triangle(120, 100, 120, 140, 145, 140);
    fill(255);

    // New rectangle with changing Y position
    rect(10, 229 + (this.mouthHeight-60), 110, 30, 10);
    noStroke();
    fill(255);
    rect(10, 169, 40, this.mouthHeight);
    // Restore stroke for other shapes
    stroke(0)
    // Eye
    fill(255);
    ellipse(this.x - 5, this.y - 100, 30, 30);

    // Pupil tracking the burger
    fill(0);
    let angle = atan2(burger.y - this.y + 10, burger.x - this.x + 10);
    let eyeX = this.x - 5 + cos(angle) * 8;
    let eyeY = this.y - 100 + sin(angle) * 8;
    ellipse(eyeX, eyeY, 15, 15);
  }
}

class Burger {
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.width = 50;
    this.height = 30;
    this.padding = 5;
  }

  update() {
    // Allow the burger to move freely across the entire screen
    this.x = mouseX;
    this.y = mouseY;

    // Check if the burger is overlapping with the face border
    if (this.x - this.width / 2 < 120) {
      this.x = 120 + this.width / 2;
    }
    if (this.y - this.height / 2 < 40) {
      this.y = 40 + this.height / 2;
    }
  }

  display() {
    fill(255);
    rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 5);

    // Black padding in the middle
    fill(0);
    rect(this.x - this.width / 2 - 10, this.y - this.padding / 2, this.width + 20, this.padding, 5);
  }
}
