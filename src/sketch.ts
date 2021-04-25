let numDots: number;

let dots: Dot[] = [];

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  numDots = height;

  for (let i = 0; i < numDots; i++) {
    dots.push(new Dot());
  }
}
function draw() {
  background(0);

  let qtree = QuadTree.create();
  for (let p of dots) {
    let point = new Point(p.x, p.y, p);
    qtree.insert(point);
  }

  for (let p of dots) {
    let range = new Circle(p.x, p.y, 200);

    let points = qtree.query(range);
    p.drawClosest(points);
    p.show();
    p.move();
  }
}

function mousePressed() {
  let qtree = QuadTree.create();
  for (let p of dots) {
    let point = new Point(p.x, p.y, p);
    qtree.insert(point);
  }
  for (const p of dots) {
    if (dist(p.x, p.y, mouseX, mouseY) < p.r * 2) {
      let range = new Circle(p.x, p.y, 100);

      let points = qtree.query(range);
      console.log(points);
    }
  }
}

function bindVector(vel: number[], magnitude = 1) {
  let x = vel[0];
  let y = vel[1];
  x *= 100 * magnitude;
  y *= 100 * magnitude;
  //scale x and y to values < 1
  if (x != 0 || y != 0) {
    let scaler = magnitude / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    x *= scaler;
    y *= scaler;
  } else {
    x = x <= -magnitude ? -magnitude : x >= magnitude ? magnitude : x;
    y = y <= -magnitude ? -magnitude : y >= magnitude ? magnitude : y;
  }

  return [x, y];
}
function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}
