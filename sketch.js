let cam;
let shutterBtn;
let emo = ["🌑","🌑","🌑","🌑","🌒","🌒","🌒","🌓","🌓","🌔","🌕","🌖","🌗","🌘"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textAlign(CENTER,CENTER);
  textSize(12);

  cam = createCapture({
    video: { facingMode: "environment" },
    audio: false
  });
  cam.size(width, height);
  cam.hide();

  shutterBtn = createButton("");
  shutterBtn.mousePressed(handleShutter);
  styleShutter();
}

function draw() {
  background(0);
  cam.loadPixels();
  for(let x = 0; x < cam.width; x += 20){
    for(let y = 0; y < cam.height; y += 20){
      let p = (x + cam.width * y) * 4 ;
      let r = cam.pixels[p];
      let g = cam.pixels[p+1];
      let b = cam.pixels[p+2];
      let br = (r + g + b)/3;
      let index = floor(map(br, 0, 255, 0, (emo.length-1)));
      text(emo[index],x-10,y-10);
      }
   }
}

async function handleShutter() {
  const blob = await new Promise(resolve => get().canvas.toBlob(resolve, "image/png"));
  const file = new File([blob], "photo.png", { type: "image/png" });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file] });
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "photo.png";
  a.click();
  URL.revokeObjectURL(url);
}

function styleShutter() {
  const size = min(width, height) * 0.16;
  shutterBtn.size(size, size);
  shutterBtn.position((width - size) / 2, height - size - 34);
  shutterBtn.style("border-radius", "50%");
  shutterBtn.style("border", "8px solid white");
  shutterBtn.style("background", "rgba(255,255,255,0.2)");
}
