let cam;
let shutterBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  cam = createCapture({
    video: { facingMode: "environment" },
    audio: false
  });
  cam.size(width, height);
  cam.hide();

  shutterBtn = createButton("");
  shutterBtn.mousePressed(takePhoto);
  styleShutter();
}

function draw() {
  background(0);
  cam.loadPixels();
  for(let x = 0; x < windowWidth; x += 30){
    for(let y = 0; y < windowHeight; y += 30){
      let p = (x + windowWidth * y) * 4 ;
      let r = cam.pixels[p];
      let g = cam.pixels[p+1];
      let b = cam.pixels[p+2];
      let emo = ["🌑","🌑","🌑","🌒","🌓","🌓","🌔","🌕","🌖","🌗","🌗","🌘","🌑","🌑","🌑"];
      let br = (r + g + b)/3;
      let index = floor(map(br, 0, 255, 0, (emo.length-1)));
      textSize(28);
      text(emo[index],x,y);
      }
   }
}

function takePhoto() {
  saveCanvas("photo", "png");
}

function styleShutter() {
  const size = min(width, height) * 0.16;
  shutterBtn.size(size, size);
  shutterBtn.position((width - size) / 2, height - size - 34);
  shutterBtn.style("border-radius", "50%");
  shutterBtn.style("border", "8px solid white");
  shutterBtn.style("background", "rgba(255,255,255,0.2)");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.size(width, height);
  styleShutter();
}
