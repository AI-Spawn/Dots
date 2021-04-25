class Dot {
  x: number;
  y: number;
  vel = bindVector([random(-1, 1), random(-1, 1)]);
  r = 5;
  speed = 10;

  lastUpdate = Date.now();
  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  move() {
    this.x += ((Date.now() - this.lastUpdate) / 100) * this.vel[0];
    this.y += ((Date.now() - this.lastUpdate) / 100) * this.vel[1];
    this.lastUpdate = Date.now();
    if (this.x < this.r / 2 || this.x > width - this.r / 2) {
      this.vel[0] *= -1;
      this.x = clamp(this.x, this.r / 2, width - this.r / 2);
    }

    if (this.y < this.r / 2 || this.y > height - this.r / 2) {
      this.vel[1] *= -1;
      this.y = clamp(this.y, this.r / 2, height - this.r / 2);
    }
  }

  drawClosest(points: Point[]) {
    stroke(255);
    strokeWeight(1);

    let d: { dot: Dot; dist: number }[] = [];
    for (const point of points) {
      let p = point.data;
      if (p != this) {
        d.push({ dot: p, dist: dist(this.x, this.y, p.x, p.y) });
      }
    }
    d.sort((a, b) => (a.dist > b.dist ? 1 : -1));

    for (let i = 0; i < min(5, d.length); i++) {
      let c = d[i];
      line(this.x, this.y, c.dot.x, c.dot.y);
    }
  }
}
