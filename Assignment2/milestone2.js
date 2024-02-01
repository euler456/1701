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
let cloudImage;
let clouds = [];
let removedBlocks = [];
let mainCharacterImage;
let facingLeft = true;
let isFacingRight = true;
let prevPlayerY = 0;
let blockCloudMovementSpeed = 2;
function preload() {
    mainCharacterImage = loadImage('maincharacter.png');
    cloudImage = loadImage('cloud.png');
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
    ball.update();
    ball.display();
    checkPlayerMovement();
    moveBlocksAndClouds(0);
}

function createCloud(x, y, width, height) {
    let cloud = new Cloud(x, y, width, height);
    cloud.originalPosition = createVector(x, y); // Store the original position
    return cloud;
}

function createBlock(id, x, y, width, height) {
    let block = new Block(id, x, y, width, height, 'static');
    block.originalPosition = createVector(x, y); // Store the original position
    return block;
}

function keyPressed() {
    // Set flags when keys are pressed
    if (keyCode === 65) {
        // A key for moving left
        leftKey = true;
    } else if (keyCode === 68) {
        // D key for moving right
        rightKey = true;
    } else if (keyCode === 87) {
        // Spacebar for jumping
        jumpKey = true;
    } else if (keyCode === 32) {
        // Spacebar for attacking
        ball.attack();
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
function checkPlayerMovement() {
    // Check if the player is on blocks with IDs 33 to 48
    let standingOnSpecialBlocks = false;
    for (let i = 0; i < blocks.length; i++) {
        if (ball.collide(blocks[i]) && blocks[i].id >= 33 && blocks[i].id <= 48) {
            standingOnSpecialBlocks = true;
            break;
        }
    }

    if (ball.y > prevPlayerY && standingOnSpecialBlocks) {
        moveBlocksAndClouds(4); // Move blocks and clouds up by 4 pixels
    }
    prevPlayerY = ball.y;
}
function moveBlocksAndClouds(dy) {
    // Move blocks and clouds only when dy is positive (upwards)
    if (dy > 0) {
        for (let i = 0; i < blocks.length; i++) {
            // Move all blocks
            if (blocks[i].position.y < blocks[i].originalPosition.y + 200) {
                blocks[i].position.y += dy;
            }
        }

        for (let i = 0; i < clouds.length; i++) {
            // Move all clouds
            if (clouds[i].position.y < clouds[i].originalPosition.y + 200) {
                clouds[i].position.y += dy;
            }
        }
    }
}



function setBlockCloudMovementSpeed(speed) {
    blockCloudMovementSpeed = speed;
}

function checkGravityCondition() {
    if (ball.y + ball.height > 0) {
        ball.gravity = 0.2;
    } else {
        ball.gravity = 0;
        ball.jumping = false;
    }
}

function createGameLevelScene(level) {
    ball = createBall();
    blocks = [];
    clouds = [];

    loadJSON(`level${level}.json`, function (data) {
        // Parse the JSON data
        if (data.blocks && Array.isArray(data.blocks)) {
            for (let i = 0; i < data.blocks.length; i++) {
                let block = createBlock(i, data.blocks[i].x, data.blocks[i].y, 50, 20);
                blocks.push(block);
            }
        } else {
            console.error('Invalid JSON format. Missing or incorrect "blocks" array.');
        }

        if (data.clouds && Array.isArray(data.clouds)) {
            // Use a loop to create clouds
            for (let i = 0; i < data.clouds.length; i++) {
                let cloud = createCloud(data.clouds[i].x, data.clouds[i].y, 80, 20);
                clouds.push(cloud);
            }
        } else {
            console.error('Invalid JSON format. Missing or incorrect "clouds" array.');
        }
    }, 'json');

    return function gameLevelScene() {
        background(120);
        fill(255);

        ball.update();
        ball.display();

        // Check if the ball is higher than the blocks and outside block's X range
        checkGravityCondition();

        let updateBlockCloudPositions = true;

        // Check if the player is on the floor
        if (ball.y === height - ball.height) {
            if (updateBlockCloudPositions) {
                // Reset the positions of blocks to their original positions
                for (let i = 0; i < blocks.length; i++) {
                    blocks[i].position.y = blocks[i].originalPosition.y;
                }

                // Reset the positions of clouds to their original positions
                for (let i = 0; i < clouds.length; i++) {
                    clouds[i].position.y = clouds[i].originalPosition.y;
                }

                updateBlockCloudPositions = false; // Set the flag to false to prevent continuous updates
            }
        } else {
            updateBlockCloudPositions = true; // Reset the flag when the player is not on the floor
        }

        // Display clouds
        for (let i = 0; i < clouds.length; i++) {
            if (clouds[i]) {
                clouds[i].moveRight(2);
                clouds[i].display();

                if (ball.collide(clouds[i])) {
                    if (ball.y + ball.height / 2 > clouds[i].position.y) {
                        ball.velocityY = 0;
                        ball.jumping = false;

                        if (updateBlockCloudPositions) {
                            moveBlocksAndClouds(-8);
                        }
                    } else {
                        ball.velocityY = 0;
                        ball.gravity = 0;
                        ball.y = clouds[i].position.y - ball.height;
                        ball.jumping = false;
                    }
                }
            }
        }

        // Display blocks
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i]) {
                blocks[i].display();

                if (ball.collide(blocks[i])) {
                    // Check if the ball is above the block
                    if (ball.y + ball.height / 2 > blocks[i].position.y) {
                        ball.velocityY = 0;
                        ball.jumping = false;

                        if (updateBlockCloudPositions) {
                            moveBlocksAndClouds(-8);
                        }

                        removedBlocks.push({ id: blocks[i].id, block: blocks.splice(i, 1)[0] });
                    } else {
                        ball.velocityY = 0;
                        ball.gravity = 0;
                        ball.y = blocks[i].position.y - ball.height;
                        ball.jumping = false;
                    }
                }
            }
        }

        refreshRemainingBlocks();
    };
}

function refreshRemainingBlocks() {
    for (let i = 0; i < removedBlocks.length; i++) {
        blocks.push(createBlock(removedBlocks[i].id));
    }
    removedBlocks = [];
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

class Block {
    constructor(id, x, y, width, height) {
        this.id = id; // Add id property
        this.position = createVector(x, y);
        this.width = width;
        this.height = height;
        this.blockImage = loadImage('mud.png'); // Load block image
    }

    display() {
        image(this.blockImage, this.position.x, this.position.y, this.width, this.height);
    }
}

class Cloud {
    constructor(x, y, width, height) {
        this.position = createVector(x, y);
        this.width = 150;
        this.height = height;
        this.cloudImage = loadImage('cloud.png'); // Load cloud image
    }

    moveRight(speed) {
        this.position.x += speed;

        // Reset the cloud position if it goes beyond the canvas width
        if (this.position.x > 800) {
            this.position.x = 0;
        }
    }

    display() {
        image(this.cloudImage, this.position.x, this.position.y, 150, this.height);
    }
}

class Ball {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.width = 30;
        this.height = 50;
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.01;
        this.jumping = false;
        this.walkRightFrames = Array.from({ length: 3 }, (_, i) =>
            loadImage(`rightwalk${i + 1}.png`)
        );
        this.walkLeftFrames = Array.from({ length: 3 }, (_, i) =>
            loadImage(`leftwalk${i + 1}.png`)
        );
        this.jumpFrames = Array.from({ length: 3 }, (_, i) =>
            loadImage(`leftjump${i + 1}.png`)
        );
        this.attackLeftFrames = Array.from({ length: 3 }, (_, i) =>
            loadImage(`leftattack${i + 1}.png`)
        );
        this.attackRightFrames = Array.from({ length: 3 }, (_, i) =>
            loadImage(`rightattack${i + 1}.png`)
        );
        // Animation properties
        this.currentFrame = 10;
        this.animationSpeed = 0.05; // Set anidmation speed

        // Default animation is walking right
        this.animationFrames = this.walkRightFrames;
    }
    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        this.velocityX = this.direction * 2; // Adjusted velocityX to slow down
        this.x += this.velocityX;

        // Keep the character within the canvas
        this.x = constrain(this.x, 0, width - this.width);
        this.y = constrain(this.y, 0, height - this.height);

        // Check if the character is on the ground
        if (this.y === height - this.height) {
            this.jumping = false;
        }

        // Update animation frame
        this.currentFrame += this.animationSpeed;

        // Check for animation change (jumping or walking)
        if (this.jumping) {
            this.animationFrames = this.jumpFrames;
        } else if (this.attacking) {
            this.animationFrames = facingLeft
                ? this.attackLeftFrames
                : this.attackRightFrames;
        } else if (this.direction === 1) {
            this.animationFrames = this.walkRightFrames;
            facingLeft = false;

        } else if (this.direction === -1) {
            this.animationFrames = this.walkLeftFrames;
            facingLeft = true;
        } else {
            this.animationFrames = [mainCharacterImage];
        }
        if (this.currentFrame >= this.animationFrames.length) {
            this.currentFrame = 0;
            this.attacking = false;
        }
        
    }
    attack() {
        if (!this.attacking) {
            this.attacking = true;
            this.animationFrames = facingLeft
                ? this.attackLeftFrames
                : this.attackRightFrames;
        }
    }
    setDirection(dir) {
        this.direction = dir;
        this.velocityX = this.direction * 2;
    }
    display() {
        // Display the current frame of the animation
        let currentFrameIndex = floor(this.currentFrame) % this.animationFrames.length;
        image(
            this.animationFrames[currentFrameIndex],
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    setDirection(dir) {
        this.direction = dir;
        this.velocityX = this.direction * 2; 
    }

    jump() {
        if (!this.jumping) {
            this.velocityY = -7;
            this.jumping = true;
            this.gravity = 0.1;
        }
    }

    collide(other) {
        if (other && other.position && other.width && other.height) {
            return (
                this.x < other.position.x + other.width &&
                this.x + this.width > other.position.x &&
                this.y < other.position.y + other.height &&
                this.y + this.height > other.position.y
            );
        }
        return false;
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
        this.velocity.y = 0;
    }
};