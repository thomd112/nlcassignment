let faceMesh;
let video;
let faces = [];
let camImg; 

function preload() {
 
  let options = { maxFaces: 1, refineLandmarks: false, flipped: true };
  faceMesh = ml5.faceMesh(options);


  camImg = loadImage('thecam.png');
}

function setup() {
 let cnv = createCanvas(640, 480);
  cnv.position(200, 100);
  cnv.style("z-index", 2);
 

  

  
  
  
  video = createCapture(VIDEO);
  video.size(640, 480); 
  video.position(200, 100);
  video.hide();
  


}
function draw() {


  strokeWeight(4);
  stroke(210, 43, 43);
  
  tint(255, 0, 0, 0); 
  
  let videoX = (width - video.width) / 2;
  let videoY = (height - video.height) / 2;

  // scale(1, -1);
  image(video, videoX, videoY);
  
  
  faceMesh.detect(video, gotFaces);
}


function gotFaces(results, error) {
  if (error) {
    console.error(error);
    return;
  }
  faces = results;

  
  let camSize = 150; 
 

  
  tint(255, 0 , 0); 

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    
    if (face.leftEye) {
      let eye = face.leftEye;
      image(camImg, eye.x - camSize / 2, eye.y - camSize / 2, camSize, camSize);
    }
    if (face.rightEye) {
      let eye = face.rightEye;
      image(camImg, eye.x - camSize / 2, eye.y - camSize / 2, camSize, camSize);
    }
  }
  
  
  noTint();
}


