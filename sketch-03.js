const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const params = {
  numCircles: 20,
  lineWidth:  5,
  connectDist: 200,
  agentRadius: 8
}

function createNavButton(text, top, link) {
  const btn = document.createElement("button")
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

createNavButton("back", "20px", "../02/bundle.html");
createNavButton("next sketch", "120px", "../04/bundle.html");


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {

  const agents = [];

  let numCircle = params.numCircles;
  for (let i = 0; i < numCircle; i++){

    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for(let i = 0; i < agents.length; i++){
      const agent = agents[i];
      
      for(let j = i + 1; j < agents.length; j++){
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        //conditional distance between nodes for connecting line
        if(dist > 200){
          continue;
        }
        else {
        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);
        // context.lineWidth = params.lineWidth; tweakpane
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
        };
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounds(width, height)
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  //method to adjust number of lines within nodes
  getDistance(v){
    const dx = this.x - v.x;
    const dy = this.y -v.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.velocity = new Vector(random.range(-1, 1), random.range(-1, 1))
    this.radius = random.range(4, 12);
  }

  // bounds(width, height){
  //   if(this.pos.x <= 0 || this.pos.x >= width ){
  //     this.velocity.x *= -1;
  //   }
  //   if(this.pos.y <= 0 || this.pos.y >= height) {
  //     this.velocity.y *= -1;
  //   }
  // } // makes circles bounce off the edges

  bounds(width, height){
    if(this.pos.x >= width){
      this.pos.x = 0;
    }
    else if(this.pos.x <= 0){
      this.pos.x = width;
    }

    if(this.pos.y >= height){
      this.pos.y = 0;
    }
    else if(this.pos.y <= 0){
      this.pos.y = height;
    }
  } // makes circles wrap around the canvas

  update() {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }

  draw(context) {
    context.strokeStyle = 'black';

    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI *2);
    context.stroke();
    context.fill();

    context.restore();
  }
}

// const animate = () => {
//   console.log("without canvas-sketch");
//   requestAnimationFrame(animate);
// } animate();

//TWEAKPANE STUFF
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({title: 'settings'});
  folder.addInput(params, 'numCircles', {min: 10, max: 100, step: 1});
  folder.addInput(params, 'lineWidth', {min: 1, max: 20});
  folder.addInput(params, 'connectDist', {min: 50, max: 400});
  folder.addInput(params, 'agentRadius', {min: 2, max: 20});


};

createPane();

