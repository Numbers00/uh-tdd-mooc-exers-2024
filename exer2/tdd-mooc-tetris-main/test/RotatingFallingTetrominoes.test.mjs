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

  test("cannot be rotated left when it would go out of bounds", () => {
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

  test("cannot be rotated left when it would overlap with other blocks", () => {
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

  test.skip("will wall kick when rotating left will make it go out of bounds", () => {
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

  test("cannot be rotated right when it would go out of bounds", () => {
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

  test.skip("cannot be rotated left when it would overlap with other blocks", () => {
    board.rotateEntityLeft();
    moveToEdgeRight(board);
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);
    console.log(`test1\n${board.toString()}`);
    board.rotateEntityRight();
    console.log(`test2\n${board.toString()}`);
    moveToEdgeRight(board);
    console.log(`test3\n${board.toString()}`);
    board.tick();
    console.log(`test4\n${board.toString()}`);
    board.rotateEntityLeft();  // This should not change anything
    console.log(`test5\n${board.toString()}`);
    expect(board.toString()).to.equalShape(
      `..........
       ........T.
       ........TT
       ........TT
       ........TT
       .........T`
    );
  })
});
