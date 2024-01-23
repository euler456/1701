let loadingScene;
let mainMenuScene;
let gameLevel1Scene;
let gameLevel2Scene;
let leaderboardScene;
let currentScene;
let playButton;

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
}

function keyPressed() {
    currentScene.keyPressed && currentScene.keyPressed();
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
    return function () {
        background(120);
        fill(255);
        textSize(32);
        text("Game Level " + level, width / 2 - 80, height / 2);
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
