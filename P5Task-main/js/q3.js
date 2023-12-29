let planetSize = 100;
let moonSize = 20;
let moon1Angle = 0;
let moon2Angle = 0;
let moon3Angle = 0;
let moon1RadiusX, moon1RadiusY, moon2RadiusX, moon2RadiusY, moon3Radius;
let planetColorBright, planetColorDark;
let moon1Color, moon2Color, moon3Color;
let centralCircleColor;

let moon1Speed, moon2Speed, moon3Speed;
let moon1Stopped = false;
let moon2Stopped = false;
let moon3Stopped = false;

let moon1X, moon1Y, moon2X, moon2Y, moon3X, moon3Y; // Declare these globally

function setup() {
  createCanvas(400, 400);
  moon1RadiusX = moonSize * 7; 
  moon1RadiusY = moonSize * 2.5; 
  moon2RadiusX = moonSize * 2.5; 
  moon2RadiusY = moonSize * 7; 
  moon3Radius = moonSize * 1.5; 

  planetColorBright = color(255, 255, 255);
  planetColorDark = color(100, 100, 100);
  moon1Color = color(255, 255, 0);
  moon2Color = color(255);
  moon3Color = color(255, 0, 0);
  centralCircleColor = moon2Color;

  moon1Speed = radians(1.5);
  moon2Speed = radians(2);
  moon3Speed = radians(2);
}

function draw() {
  background(0);

  // Calculate moon positions
  moon1X = width / 2 + cos(moon1Angle) * moon1RadiusX;
  moon1Y = height / 2 + sin(moon1Angle) * moon1RadiusY;

  moon2X = width / 2 + cos(moon2Angle) * moon2RadiusX;
  moon2Y = height / 2 + sin(moon2Angle) * moon2RadiusY;

  moon3X = moon2X + cos(moon3Angle) * moon3Radius;
  moon3Y = moon2Y + sin(moon3Angle) * moon3Radius;

  // Calculate angle between planet and moon2
  let angleBetweenPlanetAndMoon2 = atan2(moon1Y - height / 2, moon1X - width / 2);

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
    moon1Angle += moon1Speed;
  }
  if (!moon2Stopped) {
    moon2Angle += moon2Speed;
  }
  if (!moon3Stopped) {
    moon3Angle += moon3Speed;
  }
}



function mouseMoved() {
  let closestMoon = findClosestMoon(mouseX, mouseY);
  moon1Stopped = closestMoon === 'moon1' && dist(mouseX, mouseY, moon1X, moon1Y) < moonSize / 2;
  moon2Stopped = closestMoon === 'moon2' && dist(mouseX, mouseY, moon2X, moon2Y) < moonSize / 2;
  moon3Stopped = closestMoon === 'moon3' && dist(mouseX, mouseY, moon3X, moon3Y) < moonSize / 2;
}
function findClosestMoon(x, y) {
  let d1 = dist(x, y, moon1X, moon1Y);
  let d2 = dist(x, y, moon2X, moon2Y);
  let d3 = dist(x, y, moon3X, moon3Y);

  if (d1 < d2 && d1 < d3) {
    return 'moon1';
  } else if (d2 < d1 && d2 < d3) {
    return 'moon2';
  } else {
    return 'moon3';
  }
}
function mousePressed() {
  let d1 = dist(mouseX, mouseY, moon1X, moon1Y);
  let d2 = dist(mouseX, mouseY, moon2X, moon2Y);
  let d3 = dist(mouseX, mouseY, moon3X, moon3Y);

  if (d1 < moonSize / 2) {
    moon1Speed = radians(random(0.05, 1));
  }

  if (d2 < moonSize / 2) {
    moon2Speed = radians(random(0.05, 1));
  }

  if (d3 < moonSize / 2) {
    moon3Speed = radians(random(0.05, 20));
  }
}
