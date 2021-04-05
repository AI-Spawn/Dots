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
    fill(this.color);
    ellipse(this.x, this.y, this.rad * 2);
  }

  move(c) {
    this.x += this.vel[0] * (Date.now() - this.move_updated);
    this.y += this.vel[1] * (Date.now() - this.move_updated);
    this.move_updated = Date.now();

    if (this.x < -this.rad || this.x > c.width + this.rad) {
      this.vel[0] *= -1;
    }

    if (this.y < 0 || this.y > c.height) {
      this.vel[1] *= -1;
    }
  }
}
