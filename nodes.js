class node {
  constructor(x, y, vel, rad) {
    this.x = x;
    this.y = y;
    this.vel = vel;
    this.rad = rad;

    this.color = (255, 255, 255);
    this.move_updated = Date.now();
  }
  display() {
    strokeWeight(0);
    fill(this.color);
    ellipse(this.x, this.y, this.rad * 2);
  }

  move(c) {
    this.x += this.vel[0] * (Date.now() - this.move_updated);
    this.y += this.vel[1] * (Date.now() - this.move_updated);
    this.move_updated = Date.now();

    if (this.x < this.rad || this.x > c.width - this.rad) {
      this.x = keepRange(this.x, this.rad, c.width - this.rad);
      this.vel[0] *= -1;
    }

    if (this.y < this.rad || this.y > c.height) {
      this.y = keepRange(this.y, this.rad, c.height - this.rad);

      this.vel[1] *= -1;
    }
  }

  connect(x, y) {
    let d = dist(this.x, this.y, x, y);
    // if (d < line_range) {
    let thickness = 500000 / (d ** 3);

    strokeWeight(keepRange(thickness, 0, 2));
    line(this.x, this.y, x, y);
    // }
  }
}
