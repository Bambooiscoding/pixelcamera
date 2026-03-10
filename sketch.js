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
  image(cam, 0, 0, width, height);
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
