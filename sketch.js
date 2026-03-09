let cam;
let started = false;
let capturedImg = null;
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

  cam.elt.setAttribute("playsinline", "");
  cam.elt.muted = true;
  cam.elt.autoplay = true;
  cam.elt.onloadedmetadata = async () => {
    try {
      await cam.elt.play();
      started = true;
    } catch (e) {
      console.log(e);
    }
  };

  shutterBtn = createButton("");
  shutterBtn.position(0, 0);
  shutterBtn.mousePressed(handleShutter);
  shutterBtn.elt.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      handleShutter();
    },
    { passive: false }
  );
  styleShutter();
}

function draw() {
  background(0);

  if (started) {
    image(cam, 0, 0, width, height);
  }
}

function styleShutter() {
  const size = min(width, height) * 0.16;
  shutterBtn.size(size, size);

  const x = (width - size) / 2;
  const y = height - size - 34;

  shutterBtn.position(x, y);

  shutterBtn.style("border-radius", "50%");
  shutterBtn.style("border", "8px solid rgba(255,255,255,0.95)");
  shutterBtn.style("background", "rgba(255,255,255,0.22)");
  shutterBtn.style("box-shadow", "0 0 0 6px rgba(0,0,0,0.18) inset");
  shutterBtn.style("padding", "0");
  shutterBtn.style("margin", "0");
  shutterBtn.style("outline", "none");
  shutterBtn.style("z-index", "10");
}

async function handleShutter() {
  if (!started) return;

  capturedImg = get();
  await saveToPhone(capturedImg.canvas);
}

async function saveToPhone(canvasEl) {
  const blob = await canvasToBlob(canvasEl, "image/png");
  if (!blob) return;

  const file = new File([blob], "photo.png", { type: "image/png" });

  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "photo"
      });
      return;
    }
  } catch (e) {
    console.log(e);
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "photo.png";
  a.click();
  URL.revokeObjectURL(url);
}

function canvasToBlob(canvas, type = "image/png", quality = 1) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (cam) {
    cam.size(width, height);
  }

  styleShutter();
}
