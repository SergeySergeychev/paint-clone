// DOM Elements
const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");
const { body } = document;
// Global Variables
const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");
const NOMINAL_BRUSH_SIZE = 10;
const TIME_DELAY = 1500;
let currentSize = NOMINAL_BRUSH_SIZE;
let prevSize = NOMINAL_BRUSH_SIZE;
let bucketColor = "#FFFFFF";
let currentColor = "#A51DAB";
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Format Brush Size
function displayBrushSize() {
  if (brushSlider.value < NOMINAL_BRUSH_SIZE) {
    brushSize.textContent = `0${brushSlider.value}`;
  } else {
    brushSize.textContent = brushSlider.value;
  }
}

// Set Brush size
function setBrushSize() {
  currentSize = brushSlider.value;
  displayBrushSize();
}

// Switch To brush with time delay
function switchToBrushWithTimeDelay(ms) {
  setTimeout(switchToBrush, ms);
}

// Switch Back to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = "Brush";
  brushIcon.style.color = "black";
  eraser.style.color = "white";
  currentColor = `#${brushColorBtn.value}`;
  brushSlider.value = prevSize;
  currentSize = prevSize;
  displayBrushSize();
}

// Switch To Eraser
function switchToEraser() {
  isEraser = true;
  brushIcon.style.color = "white";
  eraser.style.color = "black";
  activeToolEl.textContent = "Eraser";
  currentColor = bucketColor;
  prevSize = currentSize;
  brushSlider.value = brushSlider.max;
  currentSize = brushSlider.value;
  displayBrushSize();
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 75;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

// Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = "round";
    if (drawnArray[i].erase) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Store Dranw Lines in DranwArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Start To Draw
function startToDraw(event) {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = "round";
  context.strokeStyle = currentColor;
}

// Drawing on Canvas
function drawingOnCanvas(event) {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser
    );
  } else {
    storeDrawn(undefined);
  }
}

// Set Backround Color
function setBackgroundColor() {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
}

// Set Brush Color
function setBrushColor() {
  isEraser = false;
  currentColor = `#{brushColorBtn.value}`;
}

// Clear Canvas
function clearCanvas() {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = "Canvas Cleared";
  switchToBrushWithTimeDelay(TIME_DELAY);
}

// Save Picture
function savePicture() {
  localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
  localStorage.setItem("backgroundColor", JSON.stringify(bucketColor));
  // Active Tool
  activeToolEl.textContent = "Canvas Saved";
  switchToBrushWithTimeDelay(TIME_DELAY);
}

// Load Picture
function loadPicture() {
  if (
    localStorage.getItem("savedCanvas") &&
    localStorage.getItem("backgroundColor")
  ) {
    bucketColor = JSON.parse(localStorage.backgroundColor);
    drawnArray = JSON.parse(localStorage.savedCanvas);
    createCanvas();
    restoreCanvas();
    // Active Tool
    activeToolEl.textContent = "Canvas Loaded";
    switchToBrushWithTimeDelay(TIME_DELAY);
  } else {
    activeToolEl.textContent = "No Canvas Found";
    switchToBrushWithTimeDelay(TIME_DELAY);
  }
}

// Delete Picute
function deletePicute() {
  localStorage.removeItem("savedCanvas");
  // Active Tool
  activeToolEl.textContent = "Local Storage Cleared";
  switchToBrushWithTimeDelay(TIME_DELAY);
}

// Download image on local machine
function downloadImage() {
  downloadBtn.href = canvas.toDataURL("image/jpeg", 1);
  downloadBtn.download = "paint-example.jpeg";
  // Active Tool
  activeToolEl.textContent = "Image File Saved";
  switchToBrushWithTimeDelay(TIME_DELAY);
}

/////////////////////// EVENT LISTENERS ////////////////////
// Set Brush Size on slider change.
brushSlider.addEventListener("input", setBrushSize);
// Set Brush Color on color change.
brushColorBtn.addEventListener("change", setBrushColor);

// Set Background Color on color change.
bucketColorBtn.addEventListener("change", setBackgroundColor);

// Switch to eraser when is clicked.
eraser.addEventListener("click", switchToEraser);

// Switch to brush when is clicked.
brushIcon.addEventListener("click", switchToBrush);

// If mouse clicked on canvas start to draw
canvas.addEventListener("mousedown", startToDraw);

// If mouse is located over canvas. Pressed and moving continue to draw
canvas.addEventListener("mousemove", drawingOnCanvas);

// If mouse up - end to draw
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// On click clear Canvas
clearCanvasBtn.addEventListener("click", clearCanvas);

// On click save to Local Storage
saveStorageBtn.addEventListener("click", savePicture);

// On click load from local Storage
loadStorageBtn.addEventListener("click", loadPicture);

// On click Clear Local Storage
clearStorageBtn.addEventListener("click", deletePicute);

// On click Download Image
downloadBtn.addEventListener("click", downloadImage);

// When page is loaded Create Canvas
window.addEventListener("load", createCanvas);
