export class Board {
  width;
  height;
  boardState = [];
  newestShape = {
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
    this.newestShape = { shape: block, xPos: 0, yPos: midPosition, hasFallen: false }
  }

  hasFalling() {
    return !this.newestShape.hasFallen;
  }

  tick() {
    let newBoardState = [...this.boardState];

    if (this.boardState[this.height - 1].some(e => e !== ".")) {
      this.newestShape.hasFallen = true;
      return;
    }

    // Traverse 2D array for board state from bottom up
    // to move X blocks down if they're not already
    // at the very bottom
    for (let i = this.height - 2; i >= 0; i--) {
      for (let j = 0; j < this.width; j++) {
        const targetCell = this.boardState[i][j];
        if (targetCell !== ".") {
          newBoardState[i][j] = ".";
          newBoardState[i+1][j] = targetCell;
        }
      }
    }

    this.boardState = newBoardState;
  }

  toString() {
    return this.boardState.map(row => row.join("")).join("\n") + "\n";
  }
}
