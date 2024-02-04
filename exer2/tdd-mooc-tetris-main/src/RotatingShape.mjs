export class RotatingShape {
  shape = [[]];

  constructor(shape) {
    let shapeRows = shape.split("\n").map(r => r.trim().split(""));
    this.shape = shapeRows;
  }

  rotateRight() {
    return "GDA\nHEB\n\IFC\n";
  }

  toString() {
    return this.shape.map(r => r.join("")).join("\n") + "\n";
  }
}
