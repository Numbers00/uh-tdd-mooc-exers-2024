import { expect } from "chai";
import { beforeEach, describe, test } from "vitest";

import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

function moveToEdgeLeft(board) {
  let counter = 0
  while (
    board.boardState.map(row => row[0]).every(cell => cell === ".")
    && counter < board.width
  ) {
    board.moveEntityLeft();
    counter++;
  }
}

function moveToEdgeRight(board) {
  let counter = 0
  while (
    board.boardState.map(row => row[board.width - 1]).every(cell => cell === ".")
    && counter < board.width
  ) {
    board.moveEntityRight();
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

  test("cannot be moved left beyond the board", () => {
    moveToEdgeLeft(board);
    expect(board.toString()).to.equalShape(
      `.T........
       TTT.......
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

  test("cannot be moved right beyond the board", () => {
    moveToEdgeRight(board);
    expect(board.toString()).to.equalShape(
      `........T.
       .......TTT
       ..........
       ..........
       ..........
       ..........`
    );
  })

  test("can be moved down", () => {
    board.moveEntityDown();
    expect(board.toString()).to.equalShape(
      `..........
       ....T.....
       ...TTT....
       ..........
       ..........
       ..........`
    );
  })
});
