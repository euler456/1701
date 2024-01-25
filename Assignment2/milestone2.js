class Block {
    constructor(x, y, width, height) {
        this.position = createVector(x, y);
        this.width = width;
        this.height = height;
        this.shapeColor = color(0);
    }

    display() {
        fill(this.shapeColor);
        rect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Ball {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.width = 40; // Adjust the width of the character
        this.height = 40; // Adjust the height of the character
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.4;
        this.jumping = false;
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Move horizontally based on direction
        this.velocityX = this.direction * 5;
        this.x += this.velocityX;

        // Keep the character within the canvas
        this.x = constrain(this.x, 0, width - this.width);
        this.y = constrain(this.y, 0, height - this.height);

        // Check if the character is on the ground
        if (this.y === height - this.height) {
            this.jumping = false;
        }
    }

    display() {
        // Display the character using the loaded image
        image(mainCharacterImage, this.x, this.y, this.width, this.height);
    }

    setDirection(dir) {
        this.direction = dir;
        // Adjust the velocityX based on the direction
        this.velocityX = this.direction * 5;
    }

    jump() {
        // Check if the character is on the ground and not already jumping
        if (!this.jumping) {
            this.velocityY = -10; // Jumping force
            this.jumping = true;
        }
    }

    collide(other) {
        // Adjust the collision logic based on the dimensions of the character
        return (
            this.x < other.position.x + other.width &&
            this.x + this.width > other.position.x &&
            this.y < other.position.y + other.height &&
            this.y + this.height > other.position.y
        );
    }
}

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
// Add an update method to the Sprite class
Sprite.prototype.update = function () {
    // Apply gravity
    this.velocity.y += 0.4;
    this.position.y += this.velocity.y;

    // Keep the ball within the canvas
    this.position.x = constrain(this.position.x, this.width / 2, width - this.width / 2);
    this.position.y = constrain(this.position.y, this.height / 2, height - this.height / 2);

    // Check if the ball is on the ground
    if (this.position.y === height - this.height / 2) {
        this.jumping = false;
        this.velocity.y = 0; // Stop vertical velocity when on the ground
    }
};

let loadingScene;
let mainMenuScene;
let gameLevel1Scene;
let gameLevel2Scene;
let leaderboardScene;
let currentScene;
let playButton;
let ball;
let blocks = [];
let leftKey = false;
let rightKey = false;
let jumpKey = false;
let mainCharacterImage;

function preload() {
    mainCharacterImage = loadImage('maincharacter.png');
}

function setup() {
    createCanvas(800, 600);
    loadingScene = createLoadingScene();
    mainMenuScene = createMainMenuScene();
    gameLevel1Scene = createGameLevelScene(1);
    gameLevel2Scene = createGameLevelScene(2);
    leaderboardScene = createLeaderboardScene();

    currentScene = mainMenuScene; // Set the initial scene to the main menu
}

function draw() {
    if (currentScene === loadingScene) {
        loadingScene();
    } else if (currentScene === mainMenuScene) {
        mainMenuScene();
    } else if (currentScene === gameLevel1Scene) {
        gameLevel1Scene();
    } else if (currentScene === gameLevel2Scene) {
        gameLevel2Scene();
    } else if (currentScene === leaderboardScene) {
        leaderboardScene();
    }

    // Check for key states continuously
    if (leftKey) {
        ball.setDirection(-1);
    } else if (rightKey) {
        ball.setDirection(1);
    } else {
        ball.setDirection(0);
    }

    if (jumpKey) {
        ball.jump();
        jumpKey = false; // Reset jumpKey after jumping
    }
}

function keyPressed() {
    // Set flags when keys are pressed
    if (keyCode === 65) {
        // A key for moving left
        leftKey = true;
    } else if (keyCode === 68) {
        // D key for moving right
        rightKey = true;
    } else if (keyCode === 32) {
        // Spacebar for jumping
        jumpKey = true;
    }
}

function keyReleased() {
    if (keyCode === 65) {
        leftKey = false;
        ball.setDirection(rightKey ? 1 : 0); 
    } else if (keyCode === 68) {
        rightKey = false;
        ball.setDirection(leftKey ? -1 : 0); 
    }
}

function mouseClicked() {
    currentScene.mouseClicked && currentScene.mouseClicked();
}

function createLoadingScene() {
    return function () {
        background(255);
        textSize(32);
        text("Loading...", width / 2 - 80, height / 2);

        setTimeout(() => {
            currentScene = gameLevel1Scene;
        }, 1000);
    };
}

function createMainMenuScene() {
    return function () {
        background(0);
        fill(255);
        textSize(32);
        text("Main Menu", width / 2 - 80, height / 2);

        // Draw button directly without using draw function
        fill(200);
        let buttonWidth = 100;
        let buttonHeight = 40;
        let buttonX = width / 2 - buttonWidth / 2;
        let buttonY = height / 2 + 20;

        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        fill(0);
        textSize(20);
        text("Play", buttonX + 10, buttonY + 25); // Adjusted y position

        // Handle button click
        if (
            mouseX > buttonX &&
            mouseX < buttonX + buttonWidth &&
            mouseY > buttonY &&
            mouseY < buttonY + buttonHeight &&
            mouseIsPressed
        ) {
            playButtonClicked();
        }
    };
}

function createBall() {
    let newBall = new Ball();
    return newBall;
}

function createGameLevelScene(level) {
    ball = createBall();
    loadJSON(`level${level}.json`, function (data) {
        // Parse the JSON data
        if (data.blocks && Array.isArray(data.blocks)) {
            // Use a loop to create blocks
            for (let i = 0; i < data.blocks.length; i++) {
                let block = createBlock(data.blocks[i].x, data.blocks[i].y, 100, 15);
                blocks.push(block);
            }
        } else {
            console.error('Invalid JSON format. Missing or incorrect "blocks" array.');
        }
    }, 'json');

    return function () {
        background(120);
        fill(255);

        if (blocks) {
            ball.update();
            ball.display();

            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i]) { 
                    blocks[i].display();

                    if (ball.collide(blocks[i])) {
                        // Draw a rectangle at the point of collision
                        fill(255, 0, 0); // Red color
                        noStroke();
                        rect(
                            max(ball.x - ball.width / 2, blocks[i].position.x),
                            max(ball.y - ball.height / 2, blocks[i].position.y),
                            min(ball.width, blocks[i].width),
                            min(ball.height, blocks[i].height)
                        );

                        // Adjust the ball's position if there is a collision
                        ball.y = blocks[i].position.y - ball.height / 2 - 20;

                        // Stop vertical velocity when on the block
                        ball.velocityY = 0;

                        // Set jumping to false when the ball is on the block
                        ball.jumping = false;
                    }
                }
            }
        }
    };
}
function createBlock(x, y, width, height) {
    let block = new Sprite(x, y, width, height, 'static');
    block.shapeColor = color(0);
    block.immovable = true;
    return block;
}
function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.position.x + obj2.width &&
        obj1.x + obj1.width > obj2.position.x &&
        obj1.y < obj2.position.y + obj2.height &&
        obj1.y + obj1.height > obj2.position.y
    );
}
function keyReleased() {
    // Reset flags when keys are released
    if (keyCode === 65) {
        // A key for moving left
        leftKey = false;
        ball.setDirection(0); // Set direction to 0 when the left key is released
    } else if (keyCode === 68) {
        // D key for moving right
        rightKey = false;
        ball.setDirection(0); // Set direction to 0 when the right key is released
    }
}

function createLeaderboardScene() {
    return function () {
        background(50, 100, 200);
        fill(255);
        textSize(32);
        text("Leaderboard", width / 2 - 80, height / 2);
    };
}

function playButtonClicked() {
    currentScene = loadingScene;
    console.log("Switching to Loading Scene...");
}
