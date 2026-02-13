const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const params = {
  numLines: 35,
  lineWidth: 5,
  lineLength: 100,
  arcRadius: 250,
  seed: 'tbs',
  rectColor: '#ffffff',
  circleColor: '#ffffff',
  bgColor: '#ffffff',
}

var backBtn = document.createElement("button");
backBtn.textContent = "previous sketch";
document.body.appendChild(backBtn);

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


// const degToRad = (degrees) => {
//   return (degrees/180) * Math.PI;
// };

// const randomRange = (min, max) => {
//   return Math.random() * (max - min) + min;
// }

const sketch = () => {
  return ({ context, width, height }) => {

    random.setSeed(params.seed);

    context.fillStyle = `${params.bgColor}`;
    context.fillRect(0, 0, width, height);

    context.fillStyle = `${params.rectColor}`;
    context.strokeStyle = 'white';

    const cx = width * 0.5;
    const cy = height * 0.5;

    const w = params.lineWidth;
    const h = params.lineLength;
    const radius = params.arcRadius;
    const num =  params.numLines;
    let x, y;

    for (let i = 0; i < num; i++) {
    const slice = math.degToRad(360 / num);
    const angle = slice * i;

    x = cx + radius * Math.sin(angle);
    y = cy + radius * Math.cos(angle);

    context.save();
    context.translate(x, y);
    context.rotate(-angle);
    context.scale(random.range(.5,2), 1);

    context.beginPath();
    context.rect(w * 0.5, random.range(0, -h*0.5), w, h);
    context.fill();
    context.restore();

    context.save();
    context.translate(cx, cy);
    context.rotate(-angle);

    context.lineWidth = random.range(5,20);

    context.beginPath();
    context.arc(0, 0, radius * random.range(.7,1.3), slice * random.range(1,-8), slice * random.range(1,5));
    context.strokeStyle = `${params.circleColor}`;
    context.stroke();
    context.restore();
    };
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({title: 'change to regenerate'});
  folder.addInput(params, 'seed', );
  folder.addInput(params, 'bgColor')

  folder = pane.addFolder({title: 'circle settings'});
  folder.addInput(params, 'arcRadius', {min: 50, max: 500});
  folder.addInput(params, 'circleColor')

  folder = pane.addFolder({title: 'rectangle settings'});
  folder.addInput(params, 'numLines', {min: 1, max: 100, step: 1});
  folder.addInput(params, 'lineWidth', {min: 1, max: 20});
  folder.addInput(params, 'lineLength', {min: 10, max: 200});
  folder.addInput(params, 'rectColor')
  return pane;
}

const pane = createPane();

canvasSketch(sketch, settings).then(manager => {
  pane.on('change', () => {
    manager.render();
  })
})

