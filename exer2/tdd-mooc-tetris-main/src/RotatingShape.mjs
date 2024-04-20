export class RotatingShape {
  shape = [[]];
  currOrientation = 0;
  maxOrientations = 4;
  orientations = [];

  constructor(shape, currOrientation=0, maxOrientations=4, orientations=[]) {
    let shapeRows = shape.split("\n").map(r => r.trim().split(""));
    this.shape = shapeRows;
    this.currOrientation = currOrientation;
    this.maxOrientations = maxOrientations;
    this.orientations = orientations;
  }

  rotateLeft() {
    const I_SHAPE = new RotatingShape(
      `.....
       .....
       IIII.
       .....
       .....`
    );
    if (this.shape.toString() === I_SHAPE.shape.toString()) {
      return this.rotateRight();
    }

    const O_SHAPE = new RotatingShape(
      `.OO
       .OO
       ...`
    );
    if (this.shape.toString() === O_SHAPE.shape.toString()) {
      return this;
    }

    const dims = { w: this.shape[0].length, h: this.shape.length };
    let newShape = this.shape.map(r => [...r]);
    for (let i = 0; i < dims.h; i++) {
      for (let j = 0; j < dims.w; j++) {
        newShape[dims.h - 1 - j][i] = this.shape[i][j];
      }
    }
    return new RotatingShape(
      newShape.map(r => r.join("")).join("\n")
    )
  }

  rotateRight() {
    const I_SHAPE = new RotatingShape(
      `..I..
       ..I..
       ..I..
       ..I..
       .....`
    );
    if (this.shape.toString() === I_SHAPE.shape.toString())
      return this.rotateLeft();

    const O_SHAPE = new RotatingShape(
      `.OO
       .OO
       ...`
    );
    if (this.shape.toString() === O_SHAPE.shape.toString()) {
      return this;
    }

    const dims = { w: this.shape[0].length, h: this.shape.length };
    let newShape = this.shape.map(r => [...r]);
    for (let i = 0; i < dims.h; i++) {
      for (let j = 0; j < dims.w; j++) {
        newShape[j][dims.w - 1 - i] = this.shape[i][j];
      }
    }
    return new RotatingShape(
      newShape.map(r => r.join("")).join("\n")
    )
  }

  toString() {
    return this.shape.map(r => r.join("")).join("\n") + "\n";
  }
}
