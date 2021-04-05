let num_nodes = 700;
let node_speed = .05;
let nodes = [];

let canvas;
let size_scaler = 1;

function get_scale() {
  return min(windowWidth / canvas.width, windowHeight / canvas.height);
}

function windowResized() {
  //scale window
  size_scaler = get_scale();
  canvas = createCanvas(
    screen.width * size_scaler,
    screen.height * size_scaler,
  );
  canvas.position(
    windowWidth / 2 - (canvas.width) / 2,
    0,
    "fixed",
  );

  scale(size_scaler);
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  size_scaler = get_scale();
  canvas.position(
    windowWidth / 2 - (canvas.width * size_scaler) / 2,
    0,
    "fixed",
  );
  scale(size_scaler);
  background(0);

  for (let i = 0; i < num_nodes; i++) {
    let x = random(0, canvas.width);
    let y = random(0, canvas.height);

    let vel = bind_vector(
      random(-node_speed, node_speed),
      random(-node_speed, node_speed),
      node_speed,
    );
    nodes.push(new node(x, y, vel));
  }
}
function draw() {
  background(0);
  fill(255);
  nodes.forEach((n) => {
    ellipse(n.x, n.y, 10, 10);
    n.move(canvas, size_scaler);
  });
}
