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
  }

  update(burger) {
    // Check if the burger is close to Ralph's face
    let distance = dist(this.x, this.y, burger.x, burger.y);
    this.mouthOpen = distance < 50; // Adjust the threshold as needed

    // Adjust the x-coordinate of the burger if it's inside Ralph's mouth
    if (this.mouthOpen && burger.x < this.x) {
      burger.x = this.x;
    }
  }

  display() {
    fill(255);
    rect(10, 40, 110, 170, 10);
    fill(0);
    rect(10, 40, 110, 35, 10, 10, 0, 0);
    fill(255);
    triangle(120, 100, 120, 140, 145, 140);

    // Mouth
    if (this.mouthOpen) {
      fill(255);
      rect(10, 40, 110, 20, 10, 10, 0, 0); // Rectangular mouth going down
      line(10, 60, 120, 60); // Two lines connecting the mouth
    } else {
      line(this.x + 20, this.y, this.x + 40, this.y); // Closed mouth
    }

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
  }

  display() {
    fill(255);
    rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 5);

    // Black padding in the middle
    fill(0);
    rect(this.x - this.width / 2 - 10, this.y - this.padding / 2, this.width + 20, this.padding, 5);
  }
}
