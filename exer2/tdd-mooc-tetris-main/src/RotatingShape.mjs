export class RotatingShape {
  shape = [[]];

  constructor(shape) {
    let shapeRows = shape.split("\n").map(r => r.trim().split(""));
    this.shape = shapeRows;
  }

  rotateLeft() {
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
