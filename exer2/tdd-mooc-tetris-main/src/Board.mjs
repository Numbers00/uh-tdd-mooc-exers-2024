export class Board {
  width;
  height;
  boardState = [];
  latestEntity = { ...this.DEFAULT_ENTITY };
  previousEntities = [];

  static DEFAULT_ENTITY = {
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

  _checkNewBoardWillOverlap(newBoardState) {
    let oldNumOccupiedCells = 0;
    let newNumOccupiedCells = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.boardState[i][j] !== ".") oldNumOccupiedCells++;
        if (newBoardState[i][j] !== ".") newNumOccupiedCells++; 
      }
    }
    if (newNumOccupiedCells < oldNumOccupiedCells) return true;
    return false;
  }

  _checkNewLatestEntityWillExceedBoardLeftLimit(newLatestEntity) {
    return newLatestEntity.occupiedPos.x[0] < 0;
  }

  _checkNewLatestEntityWillExceedBoardRightLimit(newLatestEntity) {
    return newLatestEntity.occupiedPos.x.at(-1) >= this.width;
  }

  _checkNewLatestEntityWillExceedBoardWidth(newLatestEntity) {
    return newLatestEntity.occupiedPos.x.some(v => v < 0 || v >= this.width);
  }

  _initEntityAllXPos(shape) {
    return Array
      .from({ length: shape[0].length }, (_, i) => i)
      .map(v => v + Math.floor(this.width / 2) - Math.floor(shape[0].length / 2))
      // this.width % 2 means the board width is odd
      .map(v => this.width % 2 ? v : v - 1);
  }

  _initEntityAllYPos(shape) {
    return Array
      .from({ length: shape.length }, (_, i) => i);
  }

  // Takes in tetromino.shape
  _calcEntityOccupiedXPos(shape, xPositions) {
    let newXPositions = [...xPositions];

    const leftMostCol = shape.map(row => row[0]);
    if (leftMostCol.every(v => v === ".")) newXPositions.shift();

    const rightMostCol = shape.map(row => row.at(-1));
    if (rightMostCol.every(v => v === ".")) newXPositions.pop();

    return newXPositions;
  }

  _calcEntityOccupiedYPos(shape, yPositions) {
    return [...yPositions]
      .filter((_, i) => shape[i].some(v => v !== "."));
  }

  // Overwrite coordinates with the new tetromino
  _overwriteBoardState(boardState, latestEntity) {
    let newBoardState = boardState.map(r => [...r]);
    let newLatestEntity = { ...latestEntity }; 

    for (let i = 0; i < newLatestEntity.shape.length; i++) {
      for (let j = 0; j < newLatestEntity.shape[0].length; j++) {
        const boardX = newLatestEntity.allPos.y[0] + i;
        const boardY = newLatestEntity.allPos.x[0] + j;
        if (
          this.previousEntities.some(
            entity => {
              if (!entity.allPos.y.includes(boardX) || !entity.allPos.x.includes(boardY))
                return false;
              const cellHasOccupant = entity.shape[Math.abs(entity.allPos.y[0] - boardX)][Math.abs(entity.allPos.x[0] - boardY)] !== ".";
              if (cellHasOccupant && newLatestEntity.shape[i][j] !== ".") {
                return true;
              }
            }
          )) continue;
        newBoardState[newLatestEntity.allPos.y[i]][newLatestEntity.allPos.x[j]] = newLatestEntity.shape[i][j];
      }
    }
    return newBoardState;
  }

  checkBoardStatesAreEqual(boardState1, boardState2) {
    if (boardState1.length !== boardState2.length) return false;
    for (let i = 0; i < boardState1.length; i++) {
      if (boardState1[i].length !== boardState2[i].length) return false;
      for (let j = 0; j < boardState1[i].length; j++) {
        if (boardState1[i][j] !== boardState2[i][j]) return false;
      }
    }
    return true;
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
      hasFallen: false,
    };
  }

  dropTetromino(tetromino) {
    const dims = { w: tetromino.shape[0].length, h: tetromino.shape.length };

    const allXPositions = this._initEntityAllXPos(tetromino.shape);

    for (let i = 0; i < dims.h; i++) {
      if (
        this.boardState[0]
        // Gets the row of the new tetromino currently being iterated on
        .slice(allXPositions[0], allXPositions[dims.w - 1] + 1)
        .some(v => v !== ".")
      ) throw new Error("already falling");
    }

    // Overwrite coordinates with the new tetromino
    for (let i = 0; i < dims.h; i++) {
      for (let j = 0; j < dims.w; j++) {
        this.boardState[i][allXPositions[j]] = tetromino.shape[i][j];
      }
    }

    this.latestEntity = {
      tetromino: tetromino,
      shape: tetromino.shape,
      dims: dims,
      allPos: {
        x: allXPositions,
        y: this._initEntityAllYPos(tetromino.shape),
      },
      occupiedPos: {
        x: this._calcEntityOccupiedXPos(tetromino.shape, allXPositions),
        y: this._calcEntityOccupiedYPos(tetromino.shape, this._initEntityAllYPos(tetromino.shape)),
      },
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
        newBoardState[newLatestEntity.allPos.y[i]][newLatestEntity.allPos.x[j] - 1] = newLatestEntity.shape[i][j];
        newBoardState[newLatestEntity.allPos.y[i]][newLatestEntity.allPos.x[j]] = ".";
      }
    }
    newLatestEntity.allPos.x = newLatestEntity.allPos.x.map(v => v - 1);
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
        newBoardState[newLatestEntity.allPos.y[i]][newLatestEntity.allPos.x[j] + 1] = newLatestEntity.shape[i][j];
        newBoardState[newLatestEntity.allPos.y[i]][newLatestEntity.allPos.x[j]] = ".";
      }
    }
    newLatestEntity.allPos.x = newLatestEntity.allPos.x.map(v => v + 1);
    newLatestEntity.occupiedPos.x = newLatestEntity.occupiedPos.x.map(v => v + 1);

    this.latestEntity = { ...newLatestEntity };

    this.boardState = newBoardState;
  }

  moveEntityDown() {
    const newLatestEntity = { ...this.latestEntity };

    if (
      newLatestEntity.occupiedPos.y.at(-1) + 1 === this.height
    ) {
      this.latestEntity.hasFallen = true;
      this.previousEntities.push({ ...this.latestEntity });
      return;
    }

    let newBoardState = this.boardState.map(r => [...r]);
    // Move the entity down by one row
    for (let i = newLatestEntity.shape.length - 1; i >= 0; i--) {
      for (let j = 0; j < newLatestEntity.shape[0].length; j++) {
        if (newLatestEntity.shape[i][j] === ".") continue;  // Skip moving empty spaces
        newBoardState[newLatestEntity.allPos.y[i] + 1][newLatestEntity.allPos.x[j]] = newLatestEntity.shape[i][j];
        newBoardState[newLatestEntity.allPos.y[i]][newLatestEntity.allPos.x[j]] = ".";
      }
    }
    newLatestEntity.allPos.y = newLatestEntity.allPos.y.map(v => v + 1);
    newLatestEntity.occupiedPos.y = newLatestEntity.occupiedPos.y.map(v => v + 1);

    if (
      this._checkNewBoardWillOverlap(newBoardState)
    ) {
      this.latestEntity.hasFallen = true;
      this.previousEntities.push({ ...this.latestEntity });
      return;
    }

    this.latestEntity = { ...newLatestEntity };

    this.boardState = newBoardState;
  }

  rotateEntityLeft({ iter = 0 } = {}) {
    if (this.latestEntity.tetromino === null || this.latestEntity.hasFallen) return;

    const tetrominoRotatedLeft = this.latestEntity.tetromino.rotateLeft();
    const newLatestEntity = {
      ...this.latestEntity,
      tetromino: tetrominoRotatedLeft,
      shape: tetrominoRotatedLeft.shape,
      occupiedPos: {
        x: this._calcEntityOccupiedXPos(tetrominoRotatedLeft.shape, this.latestEntity.allPos.x),
        y: this._calcEntityOccupiedYPos(tetrominoRotatedLeft.shape, this.latestEntity.allPos.y),
      },
    };

    if (
      this._checkNewLatestEntityWillExceedBoardLeftLimit(newLatestEntity)
    ) {
      newLatestEntity.allPos.x = newLatestEntity.allPos.x.map(v => v + 1);
      newLatestEntity.occupiedPos.x = newLatestEntity.occupiedPos.x.map(v => v + 1);
    }

    let newBoardState = this._overwriteBoardState(this.boardState, newLatestEntity);
    if (this._checkNewBoardWillOverlap(newBoardState)) {
      if (iter) {
        this.moveEntityLeft();
      } else {
        this.moveEntityRight();
        this.rotateEntityLeft({ iter: 1 });
      }

      return;
    }

    this.latestEntity = { ...newLatestEntity };
    this.boardState = newBoardState;
  }

  rotateEntityRight({ iter = 0 } = {}) {
    if (this.latestEntity.tetromino === null || this.latestEntity.hasFallen) return;

    const tetrominoRotatedRight = this.latestEntity.tetromino.rotateRight();
    const newLatestEntity = {
      ...this.latestEntity,
      tetromino: tetrominoRotatedRight,
      shape: tetrominoRotatedRight.shape,
      occupiedPos: {
        x: this._calcEntityOccupiedXPos(tetrominoRotatedRight.shape, this.latestEntity.allPos.x),
        y: this._calcEntityOccupiedYPos(tetrominoRotatedRight.shape, this.latestEntity.allPos.y),
      },
    };

    if (
      this._checkNewLatestEntityWillExceedBoardWidth(newLatestEntity)
    ) {
      newLatestEntity.allPos.x = newLatestEntity.allPos.x.map(v => v - 1);
      newLatestEntity.occupiedPos.x = newLatestEntity.occupiedPos.x.map(v => v - 1);
    };

    let newBoardState = this._overwriteBoardState(this.boardState, newLatestEntity);

    if (
      this._checkNewBoardWillOverlap(newBoardState)
    ) {
      if (iter) {
        this.moveEntityRight();
      } else {
        this.moveEntityLeft();
        this.rotateEntityRight();
      }
      return;
    }

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
