let camImg;
let eyeSize = 70; // Initial eye image size
let handsfree;
let traceImages = []; // Array to store trace images

function preload() {
  camImg = loadImage('thecam.png'); // Load eye image
}

function setup() {
  let canvas = createCanvas(880, 660);
  canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2); // Center the canvas
  
  handsfree = new Handsfree({
    showDebug: false, // Hide debug information
    facemesh: true
  });

  handsfree.start(); // Start tracking
  
  // Simple solution: Hide the video element after handsfree starts
  handsfree.on('modelReady', () => {
    console.log("Handsfree.js is ready!");
    // Hide the video element that Handsfree creates
    const video = document.querySelector('.handsfree-video');
    if (video) video.style.display = 'none';
  });
}

function draw() {
  // Clear canvas to avoid drawing previous frames
  clear();
  
  if (handsfree.data && handsfree.data.facemesh) {
    drawTrace();
    drawFaceLandmarks();
  } else {
    fill(255, 0, 0);
  }
}

function drawFaceLandmarks() {
  if (handsfree.data.facemesh.multiFaceLandmarks.length > 0) {
    let face = handsfree.data.facemesh.multiFaceLandmarks[0]; // First detected face

    if (face) {
      let leftUpper = face[159];  
      let leftLower = face[145];  
      let rightUpper = face[386]; 
      let rightLower = face[374]; 

      // Calculate eye openness (distance between the upper and lower eyelids)
      let leftEyeOpen = dist(leftUpper.x, leftUpper.y, leftLower.x, leftLower.y);
      let rightEyeOpen = dist(rightUpper.x, rightUpper.y, rightLower.x, rightLower.y);
      let eyeOpenAvg = (leftEyeOpen + rightEyeOpen) / 2;

      
      eyeSize = map(eyeOpenAvg, 0.01, 0.1, 20, 800); // Larger range for more dramatic scaling
      eyeSize = constrain(eyeSize, 20, 800); // Constrain the eye size between 50px and 300px

      // Get eye center positions
      let leftEyeCenter = face[263];
      let rightEyeCenter = face[33];

      let leftX = map(leftEyeCenter.x, 0, 1, width, 0);
      let leftY = map(leftEyeCenter.y, 0, 1, 0, height);
      let rightX = map(rightEyeCenter.x, 0, 1, width, 0);
      let rightY = map(rightEyeCenter.y, 0, 1, 0, height);

      // Apply red tint to the images
      tint(255, 0, 0);

      // Draw the eye images at the detected eye centers with dynamic size
      image(camImg, leftX - eyeSize / 2, leftY - eyeSize / 2, eyeSize, eyeSize);
      image(camImg, rightX - eyeSize / 2, rightY - eyeSize / 2, eyeSize, eyeSize);

      // Add current eye positions and sizes to trace images
      traceImages.push({x: leftX, y: leftY, size: eyeSize});
      traceImages.push({x: rightX, y: rightY, size: eyeSize});

      // Limit the number of trace images to control the trail length
      if (traceImages.length > 10) {
        traceImages.splice(0, 2);
      }
    }
  }
}

function drawTrace() {
  for (let i = 0; i < traceImages.length; i++) {
    let traceImg = traceImages[i];
    let alpha = map(i, 0, traceImages.length, 70, 25);
    tint(255, 0, 0, alpha);
    image(camImg, traceImg.x - traceImg.size / 2, traceImg.y - traceImg.size / 2, traceImg.size, traceImg.size);
  }
}
