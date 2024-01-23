let loadingScene;
let mainMenuScene;
let gameLevel1Scene;
let gameLevel2Scene;
let leaderboardScene;
let currentScene;
let playButton;
let ball;

let leftKey = false;
let rightKey = false;
let jumpKey = false;

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
    // Reset flags when keys are released
    if (keyCode === 65) {
        // A key
        leftKey = false;
    } else if (keyCode === 68) {
        // D key
        rightKey = false;
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

        // After a delay, transition to the next scene
        setTimeout(() => {
            currentScene = gameLevel1Scene;
        }, 2000); // Adjust the time according to your needs
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

function createGameLevelScene(level) {
    ball = new Ball();

    return function () {
        background(120);
        fill(255);

        // Update and display the ball
        ball.update();
        ball.display();
    };
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

class Ball {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.radius = 20;
        this.direction = 0; // -1 for left, 1 for right, 0 for stop
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

        // Keep the ball within the canvas
        this.x = constrain(this.x, this.radius, width - this.radius);
        this.y = constrain(this.y, this.radius, height - this.radius);

        // Check if the ball is on the ground
        if (this.y === height - this.radius) {
            this.jumping = false;
        }
    }

    display() {
        // Display the ball
        fill(0, 0, 255);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }

    setDirection(dir) {
        this.direction = dir;
    }

    jump() {
        // Check if the ball is on the ground and not already jumping
        if (!this.jumping) {
            this.velocityY = -10; // Jumping force
            this.jumping = true;
        }
    }
}
