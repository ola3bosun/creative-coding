const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
};

 function createNavButton(text, top, link) {
  const btn = document.createElement("button");
  btn.textContent = text;

  Object.assign(btn.style, {
    position: "absolute",
    top: top,
    left: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    cursor: "pointer",
  });

  btn.addEventListener("click", () => {
    window.location.href = link;
  });

  document.body.appendChild(btn);
  return btn;
};

createNavButton("back", "20px", "#");
createNavButton("next sketch", "120px", "../02/bundle.html");

const params = {
  cols: 5,
  rows: 5,
  scale: 0.85,    // 85% of the canvas
  gapScale: 0.05, // Gap size relative to the canvas width
  lineWidth: 2,
  bgColor: '#ffffff',
  lineColor: '#000000',
  seed: 'tubosun',
};

const sketch = () => {
  return ({ context, width, height }) => {

    random.setSeed(params.seed);

    context.fillStyle = params.bgColor;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = params.lineColor;
    context.lineWidth = params.lineWidth;

    const gridWidth = width * params.scale;
    const gridHeight = height * params.scale;

    const gap = width * params.gapScale;

    const numGapCols = params.cols - 1;
    const numGapRows = params.rows - 1;

    const cellWidth = (gridWidth - (numGapCols * gap)) / params.cols;
    const cellHeight = (gridHeight - (numGapRows * gap)) / params.rows;

    const startX = (width - gridWidth) / 2;
    const startY = (height - gridHeight) / 2;

    const off = width * 0.02;
    
    let x, y;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = startX + (cellWidth + gap) * i;
        y = startY + (cellHeight + gap) * j;

        context.beginPath();
        context.rect(x, y, cellWidth, cellHeight);
        context.stroke();

        if (random.value() > 0.5) {
          context.beginPath();
          context.rect(x + off / 2, y + off / 2, cellWidth - off, cellHeight - off);
          context.stroke();
        }
      }
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({title: 'Change text to generate new pattern'});
  folder.addInput(params, 'seed');

  folder = pane.addFolder({title: 'Grid'});
  // folder.addInput(params, 'cols', {min: 2, max: 20, step: 1});
  // folder.addInput(params, 'rows', {min: 2, max: 20, step: 1});
  folder.addInput(params, 'scale', {min: 0.1, max: 1, step: 0.01});
  folder.addInput(params, 'gapScale', {min: 0, max: 0.2, step: 0.01});

  folder = pane.addFolder({title: 'settings'});
  folder.addInput(params, 'lineWidth', {min: 1, max: 8});

  folder = pane.addFolder({title: 'Colors'});
  folder.addInput(params, 'bgColor', {options: {}});
  folder.addInput(params, 'lineColor', {options: {}});

  return pane;
};

const pane = createPane();

canvasSketch(sketch, settings).then((manager) => {
  // use manager to control the sketch
  pane.on('change', () => {
    manager.render();
  });
});
