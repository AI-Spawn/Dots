let num_nodes = 50;
let node_speed = .025;
let line_range = 500;

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
    n.display();
    n.move(canvas);
    for (let i = index + 1; i < nodes.length; i++) {
      let connection = (nodes[i].x, nodes[i].y);
      let d = dist(n.x, n.y, nodes[i].x, nodes[i].y);
      if (d < line_range) {
        let thickness = 1000 / (d ** 2);
        strokeWeight(keepRange(thickness, 0, 5));
        line(n.x, n.y, nodes[i].x, nodes[i].y);
      }
    }
  });
}
