export class RotatingShape {
  shape = [[]];

  constructor(shape) {
    let shapeRows = shape.split("\n").map(r => r.trim().split(""));
    this.shape = shapeRows;
  }

  toString() {
    return this.shape.map(r => r.join("")).join("\n") + "\n";
  }  
}
