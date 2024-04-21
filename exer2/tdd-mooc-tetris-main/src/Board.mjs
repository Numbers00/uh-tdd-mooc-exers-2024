export class Board {
  width;
  height;
  boardState = [];
  latestTetromino = {
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
    if (this.boardState[0][midPosition] !== ".") {
      throw new Error("already falling");
    }
    this.boardState[0][midPosition] = block;
    this.latestTetromino = {
      shape: block, xPos: midPosition, yPos: 0, hasFallen: false
    };
  }

  dropTetromino(tetromino) {
    const dims = { w: tetromino.shape[0].length, h: tetromino.shape.length };

    const midPosition = Math.floor(this.width / 2);
    const midPositions = Array
      .from({length: dims.w}, (_, i) => i)
      .map(v => v + midPosition - Math.floor(dims.w / 2))
      // this.width % 2 means the board width is odd
      .map(v => this.width % 2 ? v : v - 1);

    for (let i = 0; i < dims.h; i++) {
      if (
        this.boardState[0]
        // Gets the row of the new tetromino currently being iterated on
        .slice(midPositions[0], midPositions[dims.w - 1] + 1)
        .some(v => v !== ".")
      )
        throw new Error("already falling");
    }

    for (let i = 0; i < dims.h; i++) {
      for (let j = 0; j < dims.w; j++) {
        this.boardState[i][midPositions[j]] = tetromino.shape[i][j];
      }
    }
  }

  drop(entity) {
    switch (typeof entity) {
    case "string":
      this.dropBlock(entity);
      break;
    case "object":
      if (entity.shape) this.dropTetromino(entity);
      else throw new Error("unknown dropped entity");
      break;
    default:
      throw new Error("unknown dropped entity");
    }
  }

  hasFalling() {
    return !this.latestTetromino.hasFallen;
  }

  tick() {
    const latestTetromino = { ...this.latestTetromino }

    if (
      latestTetromino.yPos + 1 === this.height
      || this.boardState[latestTetromino.yPos + 1][latestTetromino.xPos] !== "."
    ) {
      this.latestTetromino.hasFallen = true;
      return;
    }

    let newBoardState = this.boardState.map(r => [...r]);
    newBoardState[latestTetromino.yPos + 1][latestTetromino.xPos] = latestTetromino.shape;
    newBoardState[latestTetromino.yPos][latestTetromino.xPos] = ".";
    latestTetromino.yPos += 1;

    this.latestTetromino = { ...latestTetromino };

    this.boardState = newBoardState;
  }

  toString() {
    return this.boardState.map(row => row.join("")).join("\n") + "\n";
  }
}
