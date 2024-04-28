import { expect } from "chai";
import { beforeEach, describe, test } from "vitest";

import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

function moveToEdgeLeft(board) {
  let counter = 0;
  while (
    counter < board.width
  ) {
    board.moveEntityLeft();
    counter++;
  }
}

describe("Falling tetrominoes", () => {
  let board;
  let shape = Tetromino.T_SHAPE;

  beforeEach(() => {
    board = new Board(10, 6);
    board.drop(shape);
  });

  test("can be rotated left", () => {
    board.rotateEntityLeft();
    expect(board.toString()).to.equalShape(
      `....T.....
       ...TT.....
       ....T.....
       ..........
       ..........
       ..........`
    );
  })

  test("cannot be rotated left when it would go out of bounds", () => {
    board.rotateEntityLeft();
    board.rotateEntityLeft();
    board.rotateEntityLeft();
    moveToEdgeLeft(board);
    board.rotateEntityLeft();
    expect(board.toString()).to.equalShape(
      `T.........
       TT........
       T.........
       ..........
       ..........
       ..........`
    );
  })

  test("can be rotated right", () => {
    board.rotateEntityRight();
    expect(board.toString()).to.equalShape(
      `....T.....
       ....TT....
       ....T.....
       ..........
       ..........
       ..........`
    );
  })
});
