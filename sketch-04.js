const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math')
const Tweakpane = require('tweakpane');

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  animate: true,
  frame: 0,
  lineCap: 'butt',
  shape: 'line',
  fillStyle: '#000000',
  bgColor: '#ffffff'
}

var backBtn = document.createElement("button");
backBtn.textContent = "previous sketch";
document.body.appendChild(backBtn);

backBtn.style.position = "absolute";
backBtn.style.top = "20px";
backBtn.style.left = "20px";
backBtn.style.padding = "10px 20px";
backBtn.style.fontSize = "16px";
backBtn.style.backgroundColor = "#ffffff";
backBtn.style.border = "2px solid #000000";
backBtn.style.cursor = "pointer";
backBtn.addEventListener("click", function() {
  window.location.href = "dist/03/bundle.html";
});

var nextBtn = document.createElement("button");
nextBtn.textContent = "next sketch";
document.body.appendChild(nextBtn);

nextBtn.style.position = "absolute";
nextBtn.style.top = "120px";
nextBtn.style.left = "20px";
nextBtn.style.padding = "10px 20px";
nextBtn.style.fontSize = "16px";
nextBtn.style.backgroundColor = "#ffffff";
nextBtn.style.border = "2px solid #000000";
nextBtn.style.cursor = "pointer";
nextBtn.addEventListener("click", function() {
  window.location.href = "dist/05/bundle.html";
});

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: params.animate
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.bgColor;
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridWidth = 0.8 * width;
    const gridHeight = 0.8 * height;
    const cellWidth = gridWidth / cols;
    const cellHeight = gridHeight / rows;
    const marginX = (width - gridWidth) / 2;
    const marginY = (height - gridHeight) / 2;

    for (i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellWidth;
      const y = row * cellHeight;
      const w = cellWidth;
      const h = cellHeight;

      const f = params.animate ? frame : params.frame;

      const n = random.noise3D(x, y, f * 10, params.freq);
      // const n = random.noise3D(x + frame * 10, y, params.freq);
      const angle = n * Math.PI * params.amp;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x, y);
      context.translate(marginX, marginY);
      context.translate(cellWidth * 0.5, cellHeight * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      if (params.shape === 'circle') {
        context.beginPath();
        context.arc(0, 0, scale * 0.5, 0, Math.PI * 2);
        context.fillStyle = params.fillStyle;
        context.fill();
      }

      else if (params.shape === 'square') {
        context.beginPath();
        context.rect(-scale * 0.5, -scale * 0.5, scale, scale);
        context.fillStyle = params.fillStyle;
        context.fill();
      }

      else {  //line
      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.strokeStyle = params.fillStyle;
      context.stroke();
     }

      context.restore();
    }
  };
};


//TWEAKPANE STUFF
const createPane = () => {
  const pane = new Tweakpane.Pane();

  let folder;

  folder = pane.addFolder({title :'Grid'});
  folder.addInput(params, 'cols', {min: 2, max: 50, step: 1});
  folder.addInput(params, 'rows', {min: 2, max: 50, step: 1});
  folder.addInput(params, 'scaleMin', {min: 1, max: 100});
  folder.addInput(params, 'scaleMax', {min: 1, max: 100});
  folder.addInput(params, 'lineCap', {options: {butt: 'butt', round: 'round', square:'square'}});

  folder = pane.addFolder({title: 'Noise'});
  folder.addInput(params, 'freq', {min: -0.01, max: 0.01});
  folder.addInput(params, 'amp', {min: 0, max: 1});

  folder = pane.addFolder({title: 'Animation'});
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', {min: 0, max: 999});

  folder = pane.addFolder({title: 'shape'});
  folder.addInput(params, 'shape', {options: {line: 'line', circle: 'circle', square: 'square'}});
  folder.addInput(params, 'fillStyle', {options: {}})
  folder.addInput(params, 'bgColor', {options: {}});
};

createPane();

canvasSketch(sketch, settings);
