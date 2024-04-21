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

  dropBlock(block) {
    const midPosition = Math.floor(this.width / 2);
    if (this.boardState[0][midPosition] !== ".")
      throw new Error("already falling");
    this.boardState[0][midPosition] = block;
    this.latestShape = { shape: block, xPos: midPosition, yPos: 0, hasFallen: false };
  }

  drop(shape) {
    switch (typeof shape) {
    case "string":
      const midPosition = Math.floor(this.width / 2);
      if (this.boardState[0][midPosition] !== ".") {
        throw new Error("already falling");
      }
      this.boardState[0][midPosition] = shape;
      this.latestShape = {
        shape: shape, xPos: midPosition, yPos: 0, hasFallen: false
      };
      break;
    default:
      throw new Error("unknown shape");
    }
  }

  hasFalling() {
    return !this.latestShape.hasFallen;
  }

  tick() {
    const latestShape = { ...this.latestShape }

    if (
      latestShape.yPos + 1 === this.height
      || this.boardState[latestShape.yPos + 1][latestShape.xPos] !== "."
    ) {
      this.latestShape.hasFallen = true;
      return;
    }

    let newBoardState = this.boardState.map(r => [...r]);
    newBoardState[latestShape.yPos + 1][latestShape.xPos] = latestShape.shape;
    newBoardState[latestShape.yPos][latestShape.xPos] = ".";
    latestShape.yPos += 1;

    this.latestShape = { ...latestShape };

    this.boardState = newBoardState;
  }

  toString() {
    return this.boardState.map(row => row.join("")).join("\n") + "\n";
  }
}
