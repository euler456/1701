let planetSize = 100;
let moonSize = 20;
let moon1Angle = 0;
let moon2Angle = 0;
let moon3Angle = 0;
let moon1RadiusX = moonSize * 7; // X-axis radius for moon1
let moon1RadiusY = moonSize * 2.5; // Y-axis radius for moon1
let moon2RadiusX = moonSize * 2.5; // X-axis radius for moon2
let moon2RadiusY = moonSize * 7; // Y-axis radius for moon2
let moon3Radius = moonSize * 1.5; // Radius for moon3
let planetColorBright, planetColorDark;
let moon1Color, moon2Color, moon3Color;
let centralCircleColor;

let moon1Stopped = false;
let moon2Stopped = false;
let moon3Stopped = false;

function setup() {
  createCanvas(400, 400);
  planetColorBright = color(255, 255, 255);
  planetColorDark = color(100, 100, 100);
  moon1Color = color(255, 255, 0);
  moon2Color = color(255);
  moon3Color = color(255, 0, 0);
  centralCircleColor = moon2Color;
}

function draw() {
  background(0);

  // Calculate moon positions
  let moon1X = width / 2 + cos(moon1Angle) * moon1RadiusX;
  let moon1Y = height / 2 + sin(moon1Angle) * moon1RadiusY;

  let moon2X = width / 2 + cos(moon2Angle) * moon2RadiusX;
  let moon2Y = height / 2 + sin(moon2Angle) * moon2RadiusY;

  let moon3X = moon2X + cos(moon3Angle) * moon3Radius;
  let moon3Y = moon2Y + sin(moon3Angle) * moon3Radius;

  // Calculate angle between planet and moon2
  let angleBetweenPlanetAndMoon2 = atan2(moon2Y - height / 2, moon2X - width / 2);

  // Draw planet
  noStroke();
  fill(planetColorDark);
  arc(width / 2, height / 2, 40, 40, angleBetweenPlanetAndMoon2 + PI / 2, angleBetweenPlanetAndMoon2 - PI / 2);
  fill(planetColorBright);
  arc(width / 2, height / 2, 40, 40, angleBetweenPlanetAndMoon2 - PI / 2, angleBetweenPlanetAndMoon2 + PI / 2);

  // Draw moons
  fill(moon1Color);
  ellipse(moon1X, moon1Y, moonSize);

  fill(moon2Color);
  ellipse(moon2X, moon2Y, moonSize);

  fill(moon3Color);
  ellipse(moon3X, moon3Y, moonSize * 0.5);

  // Draw central circle
  let centralCircleX = width / 2;
  let centralCircleY = height / 2;
  let distanceToMoon1 = dist(centralCircleX, centralCircleY, moon1X, moon1Y);
  let distanceToMoon2 = dist(centralCircleX, centralCircleY, moon2X, moon2Y);
  let distanceToMoon3 = dist(centralCircleX, centralCircleY, moon3X, moon3Y);

  if (distanceToMoon1 < distanceToMoon2 && distanceToMoon1 < distanceToMoon3) {
    centralCircleColor = moon1Color;
  } else if (distanceToMoon2 < distanceToMoon1 && distanceToMoon2 < distanceToMoon3) {
    centralCircleColor = moon2Color;
  } else {
    centralCircleColor = moon3Color;
  }

  fill(centralCircleColor);
  ellipse(centralCircleX, centralCircleY, moonSize / 2); // Draw central circle

  // Draw moon tracks
  noFill();
  stroke(moon1Color);
  ellipse(width / 2, height / 2, moon1RadiusX * 2, moon1RadiusY * 2);
  stroke(moon2Color);
  ellipse(width / 2, height / 2, moon2RadiusX * 2, moon2RadiusY * 2);
  stroke(moon3Color);
  ellipse(moon2X, moon2Y, moon3Radius * 2);

  // Update angles for animation
  if (!moon1Stopped) {
    moon1Angle += radians(1.5);
  }
  if (!moon2Stopped) {
    moon2Angle += radians(2);
  }
  if (!moon3Stopped) {
    moon3Angle += radians(2);
  }
}

function mouseMoved() {
  let d1 = dist(mouseX, mouseY, moon1X, moon1Y);
  let d2 = dist(mouseX, mouseY, moon2X, moon2Y);
  let d3 = dist(mouseX, mouseY, moon3X, moon3Y);

  if (d1 < moonSize / 2) {
    moon1Stopped = true;
  } else {
    moon1Stopped = false;
  }

  if (d2 < moonSize / 2) {
    moon2Stopped = true;
  } else {
    moon2Stopped = false;
  }

  if (d3 < moonSize / 2) {
    moon3Stopped = true;
  } else {
    moon3Stopped = false;
  }
}

function mouseClicked() {
  let d1 = dist(mouseX, mouseY, moon1X, moon1Y);
  let d2 = dist(mouseX, mouseY, moon2X, moon2Y);
  let d3 = dist(mouseX, mouseY, moon3X, moon3Y);

  if (d1 < moonSize / 2) {
    let newSpeed = random(0.05, 0.2);
    moon1AngleSpeed = newSpeed;
  }

  if (d2 < moonSize / 2) {
    let newSpeed = random(0.05, 0.2);
    moon2AngleSpeed = newSpeed;
  }

  if (d3 < moonSize / 2) {
    let newSpeed = random(0.05, 0.2);
    moon3AngleSpeed = newSpeed;
  }
}
