export class RotatingShape {
  shape = [[]];

  static I_SHAPE_ORIENTATIONS = [
    new RotatingShape(
      `.....
       .....
       IIII.
       .....
       .....`
    ),
    new RotatingShape(
      `..I..
       ..I..
       ..I..
       ..I..
       .....`
    )
  ];
  static O_SHAPE_ORIENTATIONS = [
    new RotatingShape(
      `.OO
       .OO
       ...`
    )
  ]

  constructor(shape) {
    this.shape = shape.split("\n").map(r => r.trim().split(""));
  }

  rotateLeft() {
    if (this.toString() === RotatingShape.I_SHAPE_ORIENTATIONS[0].toString()) {
      return this.rotateRight();
    }

    if (this.toString() === RotatingShape.O_SHAPE_ORIENTATIONS[0].toString()) {
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
    if (this.toString() === RotatingShape.I_SHAPE_ORIENTATIONS[1].toString())
      return this.rotateLeft();

    if (this.toString() === RotatingShape.O_SHAPE_ORIENTATIONS[0].toString())
      return this;

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
