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
let flagImage;
let clouds = [];
let flags = [];
let removedBlocks = [];
let mainCharacterImage;
let facingLeft = true;
let isFacingRight = true;
let prevPlayerY = 0;
let movedUpwards = false;
let blockCloudMovementSpeed = 2;
let floor1 = 600;
let galaxyLoopSound;
let riseMusic;
let riseMusic3;
let backgroundImg;
let cloudMusicPlayed = false;
let selectedGameLevel = 0;

function preload() {
    backgroundImg = loadImage('Background.jpg');
    mainCharacterImage = loadImage('maincharacter.png');
    cloudImage = loadImage('cloud.png');
    flagImage = loadImage('flag.png');
    galaxyLoopSound = loadSound('Galaxy-Loop.mp3');
    riseMusic =  loadSound('Rise01.mp3');
    riseMusic3 = loadSound('Rise03.mp3');

}

function setup() {
    createCanvas(800, 600);
    loadingScene = createLoadingScene();
    mainMenuScene = createMainMenuScene();
    gameLevel1Scene = createGameLevelScene(1);
    gameLevel2Scene = createGameLevelScene(1);
    leaderboardScene = createLeaderboardScene();
    currentScene = mainMenuScene; // Set the initial scene to the main menu
    galaxyLoopSound.play();
}

function draw() {
    background(0);
    image(backgroundImg, 0, 0, width, height);
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
function createFlag(x, y, width, height) {
    let flag = new Flag(x, y, width, height);
    flag.originalPosition = createVector(x, y); // Store the original position
    return flag;
}

function createBlock(id, x, y, width, height) {
    let block = new Block(id, x, y, width, height, 'static');
    block.originalPosition = createVector(x, y); // Store the original position
    return block;
}
function createIceBlock(id, x, y, width, height) {
    let block = new IceBlock(id, x, y, width, height, 'static');
    block.originalPosition = createVector(x, y); 
    return block;
}
function keyPressed() {
    if (keyCode === 65) {
        leftKey = true;
    } else if (keyCode === 68) {
        rightKey = true;
    } else if (keyCode === 87) {
        jumpKey = true;
    } else if (keyCode === 32) {
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

        // Draw "Play" button
        fill(200);
        let playButtonWidth = 150;
        let playButtonHeight = 40;
        let playButtonX = width / 2 - playButtonWidth / 2;
        let playButtonY = height / 2 + 20;

        rect(playButtonX, playButtonY, playButtonWidth, playButtonHeight);
        fill(0);
        textSize(20);
        text("Game Level1", playButtonX + 10, playButtonY + 25);

        // Draw "Game Level 2" button
        fill(200);
        let level2ButtonWidth = 150;
        let level2ButtonHeight = 40;
        let level2ButtonX = width / 2 - level2ButtonWidth / 2;
        let level2ButtonY = height / 2 + 80;

        rect(level2ButtonX, level2ButtonY, level2ButtonWidth, level2ButtonHeight);
        fill(0);
        textSize(20);
        text("Game Level 2", level2ButtonX + 10, level2ButtonY + 25);

        // Handle button clicks
        if (
            mouseX > playButtonX &&
            mouseX < playButtonX + playButtonWidth &&
            mouseY > playButtonY &&
            mouseY < playButtonY + playButtonHeight &&
            mouseIsPressed
        ) {
            playButtonClicked();
        }

        if (
            mouseX > level2ButtonX &&
            mouseX < level2ButtonX + level2ButtonWidth &&
            mouseY > level2ButtonY &&
            mouseY < level2ButtonY + level2ButtonHeight &&
            mouseIsPressed
        ) {
            level2ButtonClicked();
        }
    };
}

function createBall() {
    let newBall = new Ball();
    return newBall;
}

function checkPlayerMovement() {
    let standingOnSpecialBlocks = false;

    for (let i = 0; i < blocks.length; i++) {
        if (
            ball.collide(blocks[i]) &&
            ((blocks[i].id >= 33 && blocks[i].id <= 48) || (blocks[i].id >= 49 && blocks[i].id <= 64))
        ) {
            standingOnSpecialBlocks = true;
            // Check if the player is just starting to stand on special blocks
            if (ball.y > prevPlayerY) {
                movedUpwards = true;
            }
            prevPlayerY = ball.y; 
        }
    }
    if (movedUpwards && standingOnSpecialBlocks) {
        moveBlocksAndClouds(10);
        
    }
}
function moveBlocksAndClouds(dy) {
    if (dy > 0) {
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].position.y < blocks[i].originalPosition.y + 450) {
                blocks[i].position.y += dy;
            }
        }
        for (let i = 0; i < clouds.length; i++) {
            if (clouds[i].position.y < clouds[i].originalPosition.y + 450) {
                clouds[i].position.y += dy;
            }
        }
        if (flags[0].position.y < flags[0].originalPosition.y + 450) {
            flags[0].position.y += dy;
        }            

        floor1 += 475;
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
function playButtonClicked() {
    selectedGameLevel = 1;
    createGameLevelScene(1);
    setTimeout(() => {
        currentScene = gameLevel1Scene;
    }, 1000);
}

function level2ButtonClicked() {
    selectedGameLevel = 2;
    createGameLevelScene(2);
    setTimeout(() => {
        currentScene = gameLevel2Scene;
    }, 1000);
}
function createGameLevelScene(level) {
    console.log(level);
    ball = createBall();
    blocks = [];
    clouds = [];
    flags = [];
    removedBlocks = [];

    loadJSON(`level${level}.json`, function (data) {
        if (level ==1 && data.blocks && Array.isArray(data.blocks)) {
            for (let i = 0; i < data.blocks.length; i++) {
                let block = createBlock(i, data.blocks[i].x, data.blocks[i].y, 50, 20);
                blocks.push(block);
            }
        } else if(level == 2 && data.blocks && Array.isArray(data.blocks)){
            for (let i = 0; i < data.blocks.length; i++) {
                let block = createIceBlock(i, data.blocks[i].x, data.blocks[i].y, 50, 20);
                blocks.push(block);
            }
        }
        else {
            console.error('Invalid JSON format. Missing or incorrect "blocks" array.');
        }

        if (data.flags && Array.isArray(data.flags)) {
            for (let i = 0; i < data.flags.length; i++) {
                let flag = createFlag(data.flags[i].x, data.flags[i].y, 50, 50);
                flags.push(flag);
            }
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
        image(backgroundImg, 0, 0, width, height);
        fill(255);

        ball.update();
        ball.display();
        checkGravityCondition();

        let updateBlockCloudPositions = true;

        // Check if the player is on the floor
        if (ball.y === floor1) {
            if (updateBlockCloudPositions) {
                // Reset the positions of blocks to their original positions
                for (let i = 0; i < blocks.length; i++) {
                    blocks[i].position.y = blocks[i].originalPosition.y;
                }

                // Reset the positions of clouds to their original positions
                for (let i = 0; i < clouds.length; i++) {
                    clouds[i].position.y = clouds[i].originalPosition.y;
                }
                flags[0].position.y = flags[0].originalPosition.y;
                console.log(flags[0].position.y);
                updateBlockCloudPositions = false;
            }
        } else {
            updateBlockCloudPositions = true;
        }

        // Display flags
        for (let i = 0; i < flags.length; i++) {
            if (flags[i]) {
                flags[i].display();
                if (ball.collide(flags[i])) {
                    // Check if the ball is above the flag
                    if (ball.y + ball.height / 2 > flags[i].position.y) {
                        ball.velocityY = 0;
                        ball.jumping = false;
                
                        if (updateBlockCloudPositions) {
                            moveBlocksAndClouds(-4);
                        }
                        resetGame();
                    } else {
                        ball.velocityY = 0;
                        ball.gravity = 0;
                        ball.y = flags[i].position.y - ball.height;
                        ball.jumping = false;
                    }
                }
            }
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
                            moveBlocksAndClouds(-4);
                        }

                        // Set the flag to false when player is not on the cloud
                        cloudMusicPlayed = false;
                    } else {
                        if (!cloudMusicPlayed) {
                            riseMusic3.play();
                            cloudMusicPlayed = true; // Set the flag to true when the music is played
                        }

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
                        riseMusic.play();

                        if (updateBlockCloudPositions) {
                            moveBlocksAndClouds(-4);
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
function resetGame() {
    ball = createBall();
    blocks = [];
    clouds = [];
    flags = [];
    removedBlocks = [];
    floor1 = 600;
    currentScene = mainMenuScene;

}
class Flag {
    constructor(x, y, width, height) {
        this.position = createVector(x, y);
        this.width = width;
        this.height = height;
        this.flagImage = loadImage('flag.png'); 
    }

    display() {
        image(this.flagImage, this.position.x, this.position.y, this.width, this.height);
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

        this.velocityX = this.direction * 2; 
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
class IceBlock {
    constructor(id,x, y, width, height) {
        this.id = id;
        this.position = createVector(x, y);
        this.width = width;
        this.height = height;
        this.iceBlockImage = loadImage('iceblock.png');; 
    }
    display() {
        image(this.iceBlockImage, this.position.x, this.position.y, this.width, this.height);
    }
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
