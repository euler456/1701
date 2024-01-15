let spikeImage;

function preload() {
  spikeImage = loadImage('spike.png', imgLoaded, imgError);
}

function imgLoaded(img) {
  console.log('Image loaded successfully:', img);
}

function imgError(err) {
  console.error('Error loading image:', err);
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // Draw the spike image at a specific position
  if (spikeImage) {
    image(spikeImage, 0,0, 150, 150);
  }
}
