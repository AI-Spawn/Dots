let numDots = 30;

let dots: Dot[] = [];

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);

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
    let range = new Circle(p.x, p.y, 1000);

    let points = qtree.query(range);
    p.drawClosest(points);
  }
  for (let p of dots) {
    p.show();
  }
}
