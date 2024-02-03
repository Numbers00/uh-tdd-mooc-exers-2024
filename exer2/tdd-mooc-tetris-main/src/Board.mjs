export class Board {
  width;
  height;
  boardState = [];

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.boardState = Array.from(
      { length: height },
      () => Array.from({ length: width }, () => ".")
    );
  }

  drop(block) {
    const midPosition = Math.floor(this.width / 2);
    this.boardState[0][midPosition] = block;
  }

  tick() {
    this.boardState[0][1] = ".";
    this.boardState[1][1] = "X";
  }

  toString() {
    return this.boardState.map(row => row.join("")).join("\n") + "\n";
  }
}
