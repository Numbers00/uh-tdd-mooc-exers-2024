export class Board {
  width;
  height;
  boardState = [];
  latestEntity = {
    tetromino: null,
    shape: [[]],
    dims: { w: 0, h: 0 },
    allPos: {
      x: [-1],
      y: [-1]
    },
    occupiedPos: {
      x: [-1],
      y: [-1]
    },
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

  _getMidElem(arr) {
    return arr[Math.floor(arr.length / 2)];
  }

  _checkNewBoardWillOverlap(newBoardState, newLatestEntity) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (
          this.boardState[i][j] !== "."
          && newBoardState[i][j] !== "."
          && !newLatestEntity.occupiedPos.y.includes(i)
          && !newLatestEntity.occupiedPos.x.includes(j)
        ) return true;
      }
    }
    return false;
  }

  _checkNewLatestEntityWillExceedBoardWidth(newLatestEntity) {
    return newLatestEntity.occupiedPos.x.some(v => v < 0 || v >= this.width);
  }

  dropBlock(block) {
    const midPosition = Math.floor(this.width / 2);
    if (this.boardState[0][midPosition] !== ".") {
      throw new Error("already falling");
    }
    this.boardState[0][midPosition] = block;
    this.latestEntity = {
      tetromino: null,
      shape: [[block]],
      dims: { w: 1, h: 1 },
      allPos: {
        x: [midPosition],
        y: [0]
      },
      occupiedPos: {
        x: [midPosition],
        y: [0]
      },
      xPos: [midPosition],
      yPos: [0],
      hasFallen: false,
    };
  }

  dropTetromino(tetromino) {
    const dims = { w: tetromino.shape[0].length, h: tetromino.shape.length };

    const midPosition = Math.floor(this.width / 2);
    const targetXPositions = Array
      .from({length: dims.w}, (_, i) => i)
      .map(v => v + midPosition - Math.floor(dims.w / 2))
      // this.width % 2 means the board width is odd
      .map(v => this.width % 2 ? v : v - 1);

    for (let i = 0; i < dims.h; i++) {
      if (
        this.boardState[0]
        // Gets the row of the new tetromino currently being iterated on
        .slice(targetXPositions[0], targetXPositions[dims.w - 1] + 1)
        .some(v => v !== ".")
      ) throw new Error("already falling");
    }

    // Overwrite coordinates with the new tetromino
    for (let i = 0; i < dims.h; i++) {
      for (let j = 0; j < dims.w; j++) {
        this.boardState[i][targetXPositions[j]] = tetromino.shape[i][j];
      }
    }

    let xPositions = [...targetXPositions];

    const leftMostCol = tetromino.shape.map(row => row[0]);
    if (leftMostCol.every(v => v === ".")) xPositions.shift();

    const rightMostCol = tetromino.shape.map(row => row.at(-1));
    if (rightMostCol.every(v => v === ".")) xPositions.pop();

    this.latestEntity = {
      tetromino: tetromino,
      shape: tetromino.shape,
      dims: dims,
      allPos: {
        x: targetXPositions,
        y: Array
          .from({ length: dims.h }, (_, i) => i),
      },
      occupiedPos: {
        x: xPositions,
        y: Array
          .from({ length: dims.h }, (_, i) => i)
          .filter(v => tetromino.shape[v].some(v => v !== ".")),
      },
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
    const newLatestEntity = { ...this.latestEntity };

    for (let i = 0; i < newLatestEntity.occupiedPos.y.length; i++) {
      if (
        newLatestEntity.occupiedPos.x[0] === 0
        || this.boardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x[0] - 1] !== "."
      ) return;
    }

    let newBoardState = this.boardState.map(r => [...r]);
    // Move the entity left by one column
    for (let i = 0; i < newLatestEntity.shape.length; i++) {
      for (let j = 0; j < newLatestEntity.shape[0].length; j++) {
        if (newLatestEntity.shape[i][j] === ".") continue;  // Skip moving empty spaces
        newBoardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x[j] - 1] = newLatestEntity.shape[i][j];
        newBoardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x[j]] = ".";
      }
    }
    newLatestEntity.occupiedPos.x = newLatestEntity.occupiedPos.x.map(v => v - 1);

    this.latestEntity = { ...newLatestEntity };

    this.boardState = newBoardState;
  }

  moveEntityRight() {
    const newLatestEntity = { ...this.latestEntity };

    for (let i = 0; i < newLatestEntity.occupiedPos.y.length; i++) {
      if (
        newLatestEntity.occupiedPos.x.at(-1) + 1 === this.width
        || this.boardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x.at(-1) + 1] !== "."
      ) return;
    }

    let newBoardState = this.boardState.map(r => [...r]);
    // Move the entity right by one column
    for (let i = 0; i < newLatestEntity.shape.length; i++) {
      for (let j = newLatestEntity.shape[0].length - 1; j >= 0; j--) {
        if (newLatestEntity.shape[i][j] === ".") continue;  // Skip moving empty spaces
        newBoardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x[j] + 1] = newLatestEntity.shape[i][j];
        newBoardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x[j]] = ".";
      }
    }
    newLatestEntity.occupiedPos.x = newLatestEntity.occupiedPos.x.map(v => v + 1);

    this.latestEntity = { ...newLatestEntity };

    this.boardState = newBoardState;
  }

  moveEntityDown() {
    const newLatestEntity = { ...this.latestEntity };

    if (
      newLatestEntity.occupiedPos.y.at(-1) + 1 === this.height
      || this.boardState[newLatestEntity.occupiedPos.y.at(-1) + 1][this._getMidElem(newLatestEntity.occupiedPos.x)] !== "."
    ) {
      this.latestEntity.hasFallen = true;
      return;
    }

    let newBoardState = this.boardState.map(r => [...r]);
    // Move the entity down by one row
    for (let i = newLatestEntity.shape.length - 1; i >= 0; i--) {
      for (let j = 0; j < newLatestEntity.shape[0].length; j++) {
        if (newLatestEntity.shape[i][j] === ".") continue;  // Skip moving empty spaces
        newBoardState[newLatestEntity.occupiedPos.y[i] + 1][newLatestEntity.occupiedPos.x[j]] = newLatestEntity.shape[i][j];
        newBoardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x[j]] = ".";
      }
    }
    newLatestEntity.occupiedPos.y = newLatestEntity.occupiedPos.y.map(v => v + 1);

    this.latestEntity = { ...newLatestEntity };

    this.boardState = newBoardState;
  }

  rotateEntityLeft() {
    if (this.latestEntity.tetromino === null) return;

    const tetrominoRotatedLeft = this.latestEntity.tetromino.rotateLeft();
    const newLatestEntity = {
      ...this.latestEntity,
      tetromino: tetrominoRotatedLeft,
      shape: tetrominoRotatedLeft.shape,
      occupiedPos: {
        ...this.latestEntity.occupiedPos,
        y: Array
          .from({ length: tetrominoRotatedLeft.shape.length }, (_, i) => i)
          .filter(v => tetrominoRotatedLeft.shape[v].some(v => v !== ".")),
      },
      yPos: Array
        .from({ length: tetrominoRotatedLeft.shape.length }, (_, i) => i)
        .filter(v => tetrominoRotatedLeft.shape[v].some(v => v !== ".")),
    };

    if (
      this._checkNewLatestEntityWillExceedBoardWidth(newLatestEntity)
    ) return;

    const newBoardState = this.boardState.map(r => [...r]);
    // Overwrite coordinates with the new tetromino
    for (let i = 0; i < newLatestEntity.shape.length; i++) {
      for (let j = 0; j < newLatestEntity.shape[0].length; j++) {
        newBoardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x[j]] = newLatestEntity.shape[i][j];
      }
    }

    if (
      this._checkNewBoardWillOverlap(newBoardState, newLatestEntity)
    ) return;

    this.latestEntity = { ...newLatestEntity };
    this.boardState = newBoardState;
  }

  rotateEntityRight() {
    if (this.latestEntity.tetromino === null) return;

    const tetrominoRotatedRight = this.latestEntity.tetromino.rotateRight();
    const newLatestEntity = {
      ...this.latestEntity,
      tetromino: tetrominoRotatedRight,
      shape: tetrominoRotatedRight.shape,
      occupiedPos: {
        ...this.latestEntity.occupiedPos,
        y: Array
          .from({ length: tetrominoRotatedRight.shape.length }, (_, i) => i)
          .filter(v => tetrominoRotatedRight.shape[v].some(v => v !== ".")),
      },
      yPos: Array
        .from({ length: tetrominoRotatedRight.shape.length }, (_, i) => i)
        .filter(v => tetrominoRotatedRight.shape[v].some(v => v !== ".")),
    };

    if (
      this._checkNewLatestEntityWillExceedBoardWidth(newLatestEntity)
    ) return;

    const newBoardState = this.boardState.map(r => [...r]);
    // Overwrite coordinates with the new tetromino
    for (let i = 0; i < newLatestEntity.shape.length; i++) {
      for (let j = 0; j < newLatestEntity.shape[0].length; j++) {
        newBoardState[newLatestEntity.occupiedPos.y[i]][newLatestEntity.occupiedPos.x[j]] = newLatestEntity.shape[i][j];
      }
    }

    if (
      this._checkNewBoardWillOverlap(newBoardState, newLatestEntity)
    ) return;

    this.latestEntity = { ...newLatestEntity };
    this.boardState = newBoardState;
  }

  tick() {
    this.moveEntityDown();
  }

  toString() {
    return this.boardState.map(row => row.join("")).join("\n") + "\n";
  }
}
