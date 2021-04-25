class Dot {
  x: number;
  y: number;
  r = 5;
  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  drawClosest(points: Point[]) {
    let d = width;
    let c = this;
    for (const point of points) {
      let p = point.userData;
      if (dist(p.x, p.y, this.x, this.y) < d && p != this) {
        c = p;
      }
    }
    stroke(255);
    strokeWeight(1);

    line(this.x, this.y, c.x, c.y);
  }
}
