const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random")

const settings = {
  dimensions: [1080, 1080],
};

window.onload = () => {
  window.alert("Click on the canvas and press any key to generate a new glyph-based composition. Press ctrl + s to save the canvas as an image.");
}

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
}

createNavButton("back", "20px", "../04/bundle.html");
createNavButton("next sketch", "120px", "#");

let manager;

let text = "A";
let fontSize = 600;
const fontFamily = "serif";

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 20;
  let cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = rows * cols;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.2;

    typeContext.fillStyle = "white";
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = "top";

    const metrics = typeContext.measureText(text);

    const metricsX = metrics.actualBoundingBoxLeft * -1;
    const metricsY = metrics.actualBoundingBoxAscent * -1;
    const metricsW =
      metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const metricsH =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - metricsW) * 0.5 - metricsX;
    const ty = (rows - metricsH) * 0.5 - metricsY;

    typeContext.save();
    typeContext.translate(tx, ty);

    typeContext.beginPath();
    typeContext.rect(metricsX, metricsY, metricsW, metricsH);
    typeContext.stroke();

    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    // context.drawImage(typeCanvas, 0, 0);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height)

    context.textBaseline = 'middle';
    context.textAlign = 'centre';

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) {
        context.font = `${cell * 6}px ${fontFamily}`;
      };

      // context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.fillStyle = 'white';

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5)

      // context.fillRect(0, 0, cell, cell);
      context.fillText(glyph, 0, 0);
      

      context.restore();
    }
  };
};

const getGlyph = (v) => {
  if (v < 50) return ' ';
  if (v < 100) return '.';
  if (v < 150) return '-';
  if (v < 200) return '+';

  const glyphs = '_=/'.split('');

  return random.pick(glyphs);
}

const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  if (e.key === ' '){
    let me = 'tbs';
    text = me.toLowerCase();
  }
  else if (text.length > 1){
    // context.font = `${cell / text.length}px ${fontFamily}`;
  }
  manager.render();
};

document.addEventListener("keyup", onKeyUp);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();
