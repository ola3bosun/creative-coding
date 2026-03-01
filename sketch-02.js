const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const params = {
  numLines: 35,
  lineWidth: 5,
  lineLength: 100,
  arcRadius: 300,
  seed: 'tbs',
  bgColor: '#000000', 
  colorMode: 'monochrome', // 'palette' or 'monochrome'
  monoColor: '#ffffff',
  blendMode: 'difference',
  origin: 'center', // 'center' or 'top-left'

  // For palette mode, predefined set of colors
  useColor1: true,
  useColor2: true,
  useColor3: true,
  useColor4: true,
  useColor5: true,
  useColor6: true,
  useColor7: true,
};

const palette = ['#313B2F', '#DFE8E6', '#EFE9E0', '#0F9E99', '#202216', '#F77051', '#5D0516'];

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
 
createNavButton("back", "20px", "../01/bundle.html");
createNavButton("next sketch", "120px", "../03/bundle.html");

const settings = {
  dimensions: [ window.innerWidth, window.innerHeight]
};

const sketch = () => {
  return ({ context, width, height }) => {

    random.setSeed(params.seed);

    // Reset blend mode to normal BEFORE drawing the background
    // else the background will blend with the previous frame!
    context.globalCompositeOperation = 'source-over';
    
    context.fillStyle = params.bgColor;
    context.fillRect(0, 0, width, height);

    // Apply the selected blend mode for the shapes
    context.globalCompositeOperation = params.blendMode;

    let cx, cy;
    
    switch (params.origin) {
      case 'topLeft':
        cx = 0;
        cy = 0;
        break;
      case 'topRight':
        cx = width;
        cy = 0;
        break;
      case 'bottomLeft':
        cx = 0;
        cy = height;
        break;
      case 'bottomRight':
        cx = width;
        cy = height;
        break;
      case 'center':
      default:
        cx = width * 0.5;
        cy = height * 0.5;
        break;
    }

    const w = params.lineWidth;
    const h = params.lineLength;
    const num = params.numLines;

    let currentRadius = params.arcRadius;

    let activePalette = [];
    if (params.useColor1) activePalette.push(palette[0]);
    if (params.useColor2) activePalette.push(palette[1]);
    if (params.useColor3) activePalette.push(palette[2]); 
    if (params.useColor4) activePalette.push(palette[3]);
    if (params.useColor5) activePalette.push(palette[4]);
    if (params.useColor6) activePalette.push(palette[5]);
    if (params.useColor7) activePalette.push(palette[6]);

    activePalette = activePalette.length > 0 ? activePalette : ['#ffffff']; // Fallback to white if no colors selected
    
    let x, y;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + currentRadius * Math.sin(angle);
      y = cy + currentRadius * Math.cos(angle);

      // Determine color based on the selected mode
      const elementColor = params.colorMode === 'palette' 
        ? random.pick(activePalette) 
        : params.monoColor;

      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(.5, 2), 1);

      context.fillStyle = elementColor;
      context.beginPath();
      context.rect(-w * 0.5, random.range(-h * 0.5, 0), w, h);
      context.fill();
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);

      context.lineWidth = random.range(5, 20);
      context.strokeStyle = elementColor;

      context.beginPath();
      context.arc(0, 0, currentRadius * random.range(0.7, 1.3), slice * random.range(-8, 1), slice * random.range(1, 5));
      context.stroke();
      context.restore();
    };
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({title: 'Global Settings'});
  folder.addInput(params, 'seed');
  folder.addInput(params, 'bgColor');
  
  // Dropdown for Blend Modes
  folder.addInput(params, 'blendMode', {
    options: {
      normal: 'source-over',
      multiply: 'multiply',
      screen: 'screen',
      overlay: 'overlay',
      colorDodge: 'color-dodge',
      difference: 'difference'
    }
  });

  // Folder for Color controls
  folder = pane.addFolder({title: 'Color Settings'});
  folder.addInput(params, 'colorMode', {
    options: {
      palette: 'palette',
      monochrome: 'monochrome',
    }
  });
  folder.addInput(params, 'monoColor');

  const paletteFolder = pane.addFolder({title: 'Active Palette Colors'});
  paletteFolder.addInput(params, 'useColor1', { label: '#313B2F' });
  paletteFolder.addInput(params, 'useColor2', { label: '#DFE8E6' });
  paletteFolder.addInput(params, 'useColor3', { label: '#EFE9E0' });
  paletteFolder.addInput(params, 'useColor4', { label: '#0F9E99' });
  paletteFolder.addInput(params, 'useColor5', { label: '#202216' });
  paletteFolder.addInput(params, 'useColor6', { label: '#F77051' });
  paletteFolder.addInput(params, 'useColor7', { label: '#5D0516' });

  folder = pane.addFolder({title: 'Geometry Settings'});
  folder.addInput(params, 'origin', {
    options: {
      Center: 'center',
      'Top Left': 'topLeft',
      'Top Right': 'topRight',
      'Bottom Left': 'bottomLeft',
      'Bottom Right': 'bottomRight',
    }
  });
  folder.addInput(params, 'numLines', {min: 1, max: 100, step: 1});
  folder.addInput(params, 'arcRadius', {min: 50, max: 500});
  folder.addInput(params, 'lineWidth', {min: 1, max: 20});
  folder.addInput(params, 'lineLength', {min: 10, max: 200});
  
  return pane;
}

const pane = createPane();

canvasSketch(sketch, settings).then(manager => {
  pane.on('change', () => {
    manager.render();
  })
});