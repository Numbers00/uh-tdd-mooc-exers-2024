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

function fallToBottom(board) {
  for (let i = 0; i < 10; i++) {
    board.tick();
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

  test.skip("cannot be rotated left when it would go out of bounds", () => {
    board.rotateEntityRight();
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

  test.skip("cannot be rotated left when it would overlap with other blocks", () => {
    board.rotateEntityLeft();
    moveToEdgeRight(board);
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);
    board.rotateEntityRight();
    moveToEdgeRight(board);
    board.tick();
    board.rotateEntityLeft();  // This should not change anything
    expect(board.toString()).to.equalShape(
      `..........
       ........T.
       ........TT
       ........TT
       ........TT
       .........T`
    );
  })

  test("will wall kick when rotating left will make it go out of bounds", () => {
    board.rotateEntityRight();
    moveToEdgeLeft(board);
    board.rotateEntityLeft();
    expect(board.toString()).to.equalShape(
      `.T........
       TTT.......
       ..........
       ..........
       ..........
       ..........`
    );
  })

  test("will wall kick when rotating left will make it overlap with other blocks", () => {
    board.rotateEntityLeft();
    moveToEdgeLeft(board);
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);
    board.rotateEntityRight();
    board.moveEntityLeft();
    board.moveEntityLeft();
    board.tick();
    board.tick();
    board.rotateEntityLeft();
    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ...T......
       .TTTT.....
       TT........
       .T........`
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

  test.skip("cannot be rotated right when it would go out of bounds", () => {
    board.rotateEntityLeft();
    moveToEdgeRight(board);
    board.rotateEntityRight();
    expect(board.toString()).to.equalShape(
      `.........T
       ........TT
       .........T
       ..........
       ..........
       ..........`
    );
  })

  test.skip("cannot be rotated right when it would overlap with other blocks", () => {
    board.rotateEntityRight();
    moveToEdgeLeft(board);
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);
    board.rotateEntityLeft();
    moveToEdgeLeft(board);
    board.tick();
    board.rotateEntityRight();  // This should not change anything
    expect(board.toString()).to.equalShape(
      `..........
       .T........
       TT........
       TT........
       TT........
       T.........`
    );
  })

  test("will wall kick when rotating right will make it go out of bounds", () => {
    board.rotateEntityLeft();
    moveToEdgeRight(board);
    board.rotateEntityRight();
    expect(board.toString()).to.equalShape(
      `........T.
       .......TTT
       ..........
       ..........
       ..........
       ..........`
    );
  })

  test("will wall kick when rotating right will make it overlap with other blocks", () => {
    board.rotateEntityRight();
    moveToEdgeRight(board);
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);
    board.rotateEntityLeft();
    board.moveEntityRight();
    board.moveEntityRight();
    board.tick();
    board.tick();
    board.rotateEntityRight();
    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ......T...
       .....TTTT.
       ........TT
       ........T.`
    );
  })
});
