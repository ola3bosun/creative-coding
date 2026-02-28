const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const params = {
  numCircles: 20,
  lineWidth:  5,
  connectDist: 200,
  agentRadius: 8,
  edgeBehavior: 'bounce', // 'bounce' or 'wrap'
  bgColor: '#ffffff',    // Background color
  lineColor: '#000000',  // Connecting lines color
  agentColor: '#000000'  // Agent stroke color
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

  // Initial population
  for (let i = 0; i < params.numCircles; i++){
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = params.bgColor;
    context.fillRect(0, 0, width, height);

    // DYNAMICALLY ADD OR REMOVE AGENTS BASED ON TWEAKPANE
    if (agents.length < params.numCircles) {
        for (let i = agents.length; i < params.numCircles; i++) {
            agents.push(new Agent(random.range(0, width), random.range(0, height)));
        }
    } else if (agents.length > params.numCircles) {
        agents.splice(params.numCircles);
    }

    for(let i = 0; i < agents.length; i++){
      const agent = agents[i];
      
      for(let j = i + 1; j < agents.length; j++){
        const other = agents[j];
        const dist = agent.pos.getDistance(other.pos);

        // USE TWEAKPANE CONNECT DISTANCE
        if(dist > params.connectDist){
          continue;
        }
        else {
          // USE TWEAKPANE LINE WIDTH AND CONNECT DISTANCE FOR MAPPING
          context.lineWidth = math.mapRange(dist, 0, params.connectDist, params.lineWidth, 1);
          context.beginPath();
          context.moveTo(agent.pos.x, agent.pos.y);
          context.lineTo(other.pos.x, other.pos.y);
          context.strokeStyle = params.lineColor;
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

  bounds(width, height){
    //bounce method    
    if(params.edgeBehavior === 'bounce'){
      if(this.pos.x <= 0 || this.pos.x >= width ){
        this.velocity.x *= -1;
      }
      if(this.pos.y <= 0 || this.pos.y >= height) {
        this.velocity.y *= -1;
      }
    }

    //wrap method else 
    if(params.edgeBehavior === 'wrap'){
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
    }
  }

  update() {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }

 draw(context) {
    context.strokeStyle = params.agentColor;

    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();

    context.arc(0, 0, params.agentRadius, 0, Math.PI * 2); 
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
  folder.addInput(params, 'connectDist', {min: 50, max: 200});
  folder.addInput(params, 'agentRadius', {min: 2, max: 25});

  folder.addInput(params, 'edgeBehavior', {
    options: {
      bounce: 'bounce',
      wrap: 'wrap'
    }
  });

  folder.addInput(params, 'bgColor');
  folder.addInput(params, 'lineColor');
  folder.addInput(params, 'agentColor');
};

createPane();

