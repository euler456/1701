let comedyCount = 4;
let actionCount = 5;
let romanceCount = 6;
let dramaCount = 11;
let sciFiCount = 8;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  let centerX = width / 2;
  let centerY = height / 2;
  let totalMovies = comedyCount + actionCount + romanceCount + dramaCount + sciFiCount;

  // Draw Comedy slice
  fill('red');
  let comedyAngle = (comedyCount / totalMovies) * TWO_PI;
  arc(centerX, centerY, 200, 200, 0, comedyAngle);
  labelSlice("Comedy", comedyCount, comedyAngle / 2);

  // Draw Action slice
  fill('blue');
  let actionAngle = (actionCount / totalMovies) * TWO_PI;
  arc(centerX, centerY, 200, 200, comedyAngle, comedyAngle + actionAngle);
  labelSlice("Action", actionCount, comedyAngle + actionAngle / 2);

  // Draw Romance slice
  fill('yellow');
  let romanceAngle = (romanceCount / totalMovies) * TWO_PI;
  arc(centerX, centerY, 200, 200, comedyAngle + actionAngle, comedyAngle + actionAngle + romanceAngle);
  labelSlice("Romance", romanceCount, comedyAngle + actionAngle + romanceAngle / 2);

  // Draw Drama slice
  fill('green');
  let dramaAngle = (dramaCount / totalMovies) * TWO_PI;
  arc(centerX, centerY, 200, 200, comedyAngle + actionAngle + romanceAngle, comedyAngle + actionAngle + romanceAngle + dramaAngle);
  labelSlice("Drama", dramaCount, comedyAngle + actionAngle + romanceAngle + dramaAngle / 2);

  // Draw SciFi slice
  fill('pink');
  let sciFiAngle = (sciFiCount / totalMovies) * TWO_PI;
  arc(centerX, centerY, 200, 200, comedyAngle + actionAngle + romanceAngle + dramaAngle, comedyAngle + actionAngle + romanceAngle + dramaAngle + sciFiAngle);
  labelSlice("SciFi", sciFiCount, comedyAngle + actionAngle + romanceAngle + dramaAngle + sciFiAngle / 2);
}

function labelSlice(label, value, angle) {
  let labelX = width / 2 + cos(angle) * 100;
  let labelY = height / 2 + sin(angle) * 100;
  textAlign(CENTER, CENTER);
  textSize(12);
  fill(0);
  let percentage = ((value / (comedyCount + actionCount + romanceCount + dramaCount + sciFiCount)) * 100).toFixed(2);
  text(`${label}\n`+`${value}`+`(${percentage}%)`, labelX, labelY);
}
