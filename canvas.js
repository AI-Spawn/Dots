let num_nodes = 20;
let node_speed = .025;
let line_range = 400;

let node_rad = 5;

let nodes = [];

let canvas;
let size_scaler = 1;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(
    windowWidth / 2 - (canvas.width * size_scaler) / 2,
    0,
    "fixed",
  );
  background(0);

  for (let i = 0; i < num_nodes; i++) {
    let x = random(0, canvas.width);
    let y = random(0, canvas.height);

    let vel = bindVector(
      random(-node_speed, node_speed),
      random(-node_speed, node_speed),
      node_speed,
    );
    nodes.push(new node(x, y, vel, node_rad));
  }

  stroke(255);
}
function draw() {
  background(0);
  fill(255);
  nodes.forEach((n, index) => {
    n.move(canvas);
    n.display();
    let distances = [];

    for (let i = index + 1; i < nodes.length; i++) {
      distances.push({
        node: nodes[i],
        dist: dist(n.x, n.y, nodes[i].x, nodes[i].y),
      });
    }
    distances.sort((a, b) => (a.dist > b.dist) ? 1 : -1);

    for (let i = 0; i < min(5, nodes.length - index - 1); i++) {
      let c = distances[i];
      n.connect(c.node.x, c.node.y);
    }
  });
}

function mouseClicked() {
  nodes = [];
  setup();
}
