export class Board {
  width;
  height;
  boardState = [];
  latestShape = {
    shape: "",
    xPos: -1,
    yPos: -1,
    hasFallen: false
  }

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
    if (this.boardState[0][midPosition] !== ".") {
      throw new Error("already falling");
    }
    this.boardState[0][midPosition] = block;
    this.latestShape = {
      shape: block, xPos: midPosition, yPos: 0, hasFallen: false
    }
  }

  hasFalling() {
    return !this.latestShape.hasFallen;
  }

  tick() {
    let newBoardState = [...this.boardState];

    if (this.boardState[this.height - 1].some(e => e !== ".")) {
      this.latestShape.hasFallen = true;
      return;
    }

    if (this.latestShape.yPos + 1 !== this.height && this.boardState[this.latestShape.yPos + 1][this.latestShape.xPos] === ".") {
      newBoardState[this.latestShape.yPos + 1][this.latestShape.xPos] = this.latestShape.shape;
      newBoardState[this.latestShape.yPos][this.latestShape.xPos] = ".";
      this.latestShape.yPos += 1;
    }

    // Traverse 2D array for board state from bottom up
    // to move X blocks down if they're not already
    // at the very bottom

    this.boardState = newBoardState;
  }

  toString() {
    return this.boardState.map(row => row.join("")).join("\n") + "\n";
  }
}
