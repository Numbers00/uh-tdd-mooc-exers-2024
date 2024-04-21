import { expect } from "chai";
import { beforeEach, describe, test } from "vitest";

import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

describe("Falling tetrominoes", () => {
  let board;
  let shape = Tetromino.T_SHAPE;

  beforeEach(() => {
    board = new Board(10, 6);
    board.drop(shape);
  });

  test("can be moved left", () => {
    board.moveEntityLeft();
    expect(board.toString()).to.equalShape(
      `...T......
       ..TTT.....
       ..........
       ..........
       ..........
       ..........`
    );
  })

  test("can be moved right", () => {
    board.moveEntityRight();
    expect(board.toString()).to.equalShape(
      `.....T....
       ....TTT...
       ..........
       ..........
       ..........
       ..........`
    );
  })

  test.skip("can be moved down", () => {
    board.moveEntityDown();
    expect(board.toString()).to.equalShape(
      `..........
       ...T......
       ..TTT.....
       ..........
       ..........
       ..........`
    );
  })
});
