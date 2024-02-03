export class Board {
  width;
  height;

  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  toString() {
    return `${".".repeat(this.width)}\n`.repeat(this.height);
  }
}
