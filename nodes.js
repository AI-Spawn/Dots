class node {
  constructor(x, y, vel) {
    this.x = x;
    this.y = y;
    this.vel = vel;

    this.move_updated = Date.now();
  }
  move(c) {
    this.x += this.vel[0] * (Date.now() - this.move_updated);
    this.y += this.vel[1] * (Date.now() - this.move_updated);
    this.move_updated = Date.now();

    if (this.x < 0) {
      this.x = c.width;
    } else if (this.x > c.width) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = c.height;
    } else if (this.y > c.height) {
      this.y = 0;
    }
  }
}
