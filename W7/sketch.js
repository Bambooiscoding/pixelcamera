let cam
let started=false
let frozen=false
let processed

let startBtn
let freezeBtn
let resumeBtn
let saveBtn

function setup(){
createCanvas(windowWidth,windowHeight)
pixelDensity(1)
processed=createGraphics(width,height)
processed.pixelDensity(1)
createUI()
}

function draw(){
background(0)

if(!started||!cam)return

cam.loadPixels()

if(cam.pixels.length>0&&!frozen){
processCamera()
}

image(processed,0,0,width,height)
}

function startCamera(){
if(started)return
started=true

cam=createCapture({
video:{facingMode:"environment"},
audio:false
})

cam.size(width,height)
cam.hide()
cam.elt.setAttribute("playsinline","")
cam.elt.muted=true
cam.elt.autoplay=true
cam.elt.onloadedmetadata=()=>{cam.elt.play()}
}

function processCamera(){
cam.loadPixels()
processed.loadPixels()

for(let y=0;y<height;y++){
for(let x=0;x<width;x++){

let p=(x+y*width)*4

let r=cam.pixels[p]
let g=cam.pixels[p+1]
let b=cam.pixels[p+2]

let br=(r*2+g*3+b)/6

if(br>140){
processed.pixels[p]=min(255,r*1.1)
processed.pixels[p+1]=min(255,g*1.05)
processed.pixels[p+2]=min(255,b*1.2)
}else{
processed.pixels[p]=r*0.6
processed.pixels[p+1]=g*0.65
processed.pixels[p+2]=b*0.9
}

processed.pixels[p+3]=255
}
}

processed.updatePixels()
}

function createUI(){

startBtn=createButton("Start")
startBtn.position(20,20)
startBtn.mousePressed(startCamera)

freezeBtn=createButton("Freeze")
freezeBtn.position(20,70)
freezeBtn.mousePressed(()=>{
frozen=true
})

resumeBtn=createButton("Resume")
resumeBtn.position(20,120)
resumeBtn.mousePressed(()=>{
frozen=false
})

saveBtn=createButton("Save")
saveBtn.position(20,170)
saveBtn.mousePressed(saveImage)
}

function saveImage(){
saveCanvas(processed,"photo","png")
}

function windowResized(){
resizeCanvas(windowWidth,windowHeight)
if(cam)cam.size(width,height)
processed=createGraphics(width,height)
processed.pixelDensity(1)
}