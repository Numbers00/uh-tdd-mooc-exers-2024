export class Board {
  width;
  height;
  boardState = [];
  latestEntity = {
    shape: [[]],
    xPos: [-1],
    yPos: [-1],
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

  getMidElem(arr) {
    return arr[Math.floor(arr.length / 2)];
  }

  dropBlock(block) {
    const midPosition = Math.floor(this.width / 2);
    if (this.boardState[0][midPosition] !== ".") {
      throw new Error("already falling");
    }
    this.boardState[0][midPosition] = block;
    this.latestEntity = {
      shape: [[block]], xPos: [midPosition], yPos: [0], hasFallen: false
    };
  }

  dropTetromino(tetromino) {
    const dims = { w: tetromino.shape[0].length, h: tetromino.shape.length };

    const midPosition = Math.floor(this.width / 2);
    const xPositions = Array
      .from({length: dims.w}, (_, i) => i)
      .map(v => v + midPosition - Math.floor(dims.w / 2))
      // this.width % 2 means the board width is odd
      .map(v => this.width % 2 ? v : v - 1);

    for (let i = 0; i < dims.h; i++) {
      if (
        this.boardState[0]
        // Gets the row of the new tetromino currently being iterated on
        .slice(xPositions[0], xPositions[dims.w - 1] + 1)
        .some(v => v !== ".")
      )
        throw new Error("already falling");
    }

    for (let i = 0; i < dims.h; i++) {
      for (let j = 0; j < dims.w; j++) {
        this.boardState[i][xPositions[j]] = tetromino.shape[i][j];
      }
    }
    this.latestEntity = {
      shape: tetromino.shape,
      xPos: xPositions,
      yPos: Array
        .from({ length: dims.h }, (_, i) => i)
        .filter(v => tetromino.shape[v].some(v => v !== ".")),
      hasFallen: false
    };
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
    return !this.latestEntity.hasFallen;
  }

  moveEntityLeft() {
    const latestEntity = { ...this.latestEntity };

    if (latestEntity.xPos[0] === 0) return;

    let newBoardState = this.boardState.map(r => [...r]);
    // Move the entity left by one column
    for (let i = 0; i < latestEntity.shape.length; i++) {
      for (let j = 0; j < latestEntity.shape[0].length; j++) {
        if (latestEntity.shape[i][j] === ".") continue;  // Skip moving empty spaces
        newBoardState[latestEntity.yPos[i]][latestEntity.xPos[j] - 1] = latestEntity.shape[i][j];
        newBoardState[latestEntity.yPos[i]][latestEntity.xPos[j]] = ".";
      }
    }
  }

  tick() {
    const latestEntity = { ...this.latestEntity };

    if (
      latestEntity.yPos.at(-1) + 1 === this.height
      || this.boardState[latestEntity.yPos.at(-1) + 1][this.getMidElem(latestEntity.xPos)] !== "."
    ) {
      this.latestEntity.hasFallen = true;
      return;
    }

    let newBoardState = this.boardState.map(r => [...r]);
    // Move the entity down by one row
    for (let i = latestEntity.shape.length - 1; i >= 0; i--) {
      for (let j = 0; j < latestEntity.shape[0].length; j++) {
        if (latestEntity.shape[i][j] === ".") continue;  // Skip moving empty spaces
        newBoardState[latestEntity.yPos[i] + 1][latestEntity.xPos[j]] = latestEntity.shape[i][j];
        newBoardState[latestEntity.yPos[i]][latestEntity.xPos[j]] = ".";
      }
    }
    latestEntity.yPos = latestEntity.yPos.map(v => v + 1);

    this.latestEntity = { ...latestEntity };

    this.boardState = newBoardState;
  }

  toString() {
    return this.boardState.map(row => row.join("")).join("\n") + "\n";
  }
}
