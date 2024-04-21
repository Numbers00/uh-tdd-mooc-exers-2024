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

function moveToEdgeRight(board) {
  let counter = 0;
  while (
    counter < board.width
  ) {
    board.moveEntityRight();
    counter++;
  }
}

function moveToEdgeDown(board) {
  let counter = 0;
  while (
    counter < board.width
  ) {
    board.moveEntityDown();
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
    board.moveEntityLeft();
    expect(board.toString()).to.equalShape(
      `.T........
       TTT.......
       ..........
       ..........
       ..........
       ..........`
    );
  })

  test("cannot be moved left through other blocks", () => {
    moveToEdgeLeft(board);

    board.drop(shape);
    moveToEdgeLeft(board);
    board.moveEntityLeft();

    expect(board.toString()).to.equalShape(
      `.T..T.....
       TTTTTT....
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
    board.moveEntityRight();
    expect(board.toString()).to.equalShape(
      `........T.
       .......TTT
       ..........
       ..........
       ..........
       ..........`
    );
  })

  test("cannot be moved right through other blocks", () => {
    moveToEdgeRight(board);

    board.drop(shape);
    moveToEdgeRight(board);
    board.moveEntityRight();

    expect(board.toString()).to.equalShape(
      `.....T..T.
       ....TTTTTT
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

  test("cannot be moved down beyond the board", () => {
    moveToEdgeDown(board);
    board.moveEntityDown();
    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ..........
       ..........
       ....T.....
       ...TTT....`
    );
  });

  test("cannot be moved down through other blocks", () => {
    moveToEdgeDown(board);

    board.drop(shape);
    moveToEdgeDown(board);
    board.moveEntityDown();

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ....T.....
       ...TTT....
       ....T.....
       ...TTT....`
    );
  })
});
