function setup() {
    createCanvas(400, 400);
  }

  
function draw() {
    background(255);

    
    // Doraemon's body
    fill('#0294A5');
    rect(125, 180, 150, 150,30);
    //foot
    fill(255);
    ellipse(240, 325, 80, 50);
    ellipse(160, 325, 80, 50);
    // Doraemon's face
    fill('#0294A5'); 
    ellipse(200, 100, 200, 200);
    fill(255);
    ellipse(200, 120, 170, 160);
    // Doraemon's eyes
    fill(255);
    ellipse(180, 40, 40, 50);
    ellipse(220, 40, 40, 50);
  
    // Doraemon's pupils
    fill(0);
    ellipse(188, 43, 10, 15);
    ellipse(212, 43, 10, 15);
  
    fill(255);
    ellipse(190, 43, 5, 5);
    ellipse(210, 43, 5, 5);
    // Doraemon's nose
    fill('#E44D26'); // Red color for Doraemon's nose
    ellipse(200, 65, 20, 20);
  
    // Doraemon's mouth
    noFill();
    stroke(0);
    line(200, 75, 200, 160);
    arc(200, 140, 125, 40, 0, PI);
  
    // Doraemon's whiskers
    stroke(0);
    line(170, 90, 100, 60);
    line(170, 100, 100, 100);
    line(170, 110, 100, 140);
    line(230, 90, 300, 60);
    line(230, 100, 300, 100);
    line(230, 110, 300, 140);
    //red 
    fill(255, 0, 0);
    rect(125, 190, 150, 10,30);
    // bell
    fill('#FFD100'); // Yellow color for Doraemon's bell
    ellipse(200, 210, 30, 30);
    rect(185, 207, 30, 5);
    fill(0)
    rect(197, 215, 7, 10);

    
  }
  