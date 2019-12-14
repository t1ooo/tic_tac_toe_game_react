'use strict';

import { Move, Winner, TicTacToeGame, GameOverError, CheckedError } from './TicTacToeGame';

const SIZE = 3;
const MAX_POSITION =  SIZE*SIZE-1;

function defaultTicTacToeGame() {
  return new TicTacToeGame(SIZE);
}


it('new instance', () => {
  const game = defaultTicTacToeGame();
});

it('new instance with bad size', () => {
  expect(() => {
    const game = new TicTacToeGame(-1);
  }).toThrow(RangeError);
});

it('goToMove', () => {
  const game = defaultTicTacToeGame();
  game.goToMove(0);
  game.check(0);
  game.goToMove(1);
});

it('goToMove with bad index', () => {
  const game = defaultTicTacToeGame();
  expect(() => {
    game.goToMove(1);
  }).toThrow(RangeError);
});

it('check', () => {
  const game = defaultTicTacToeGame();
  game.check(0);
  game.check(1);
  game.check(2);
});

it('check with bad position', () => {
  const game = defaultTicTacToeGame();
  expect(() => {
    game.check(-1);
  }).toThrow(RangeError);
  expect(() => {
    game.check(MAX_POSITION + 1);
  }).toThrow(RangeError);
});

it('check with already checked', () => {
  const game = defaultTicTacToeGame();
  game.check(0);
  expect(() => {
    game.check(0);
  }).toThrow(CheckedError);
});

it('check when game over', () => {
  const game = defaultTicTacToeGame();
  // X           // Y
  game.check(0); game.check(1);
  game.check(3); game.check(4);
  game.check(6);
  expect(() => {
    game.check(7);
  }).toThrow(GameOverError);
});

it('isChecked', () => {
  const game = defaultTicTacToeGame();
  game.check(0);
  expect(game.isChecked(0)).toBe(true);
  for(let i=1; i<=MAX_POSITION; i++) {
    expect(game.isChecked(i)).toBe(false);
  }
});

it('getNextPlayer', () => {
  const game = defaultTicTacToeGame();
  expect(game.getNextPlayer(0)).toBe('X');
  game.check(0);
  expect(game.getNextPlayer(0)).toBe('O');
});

it('getNextPlayer after goToMove', () => { 
  const game = defaultTicTacToeGame();
  game.check(0);
  game.check(1);
  game.check(2);
  game.check(3);
  
  for(let i=0; i<=3; i++) {
    game.goToMove(i);
    expect(game.getNextPlayer()).toBe(i%2===0?'X':'O');
  }
});

it('lookup', () => { 
  const game = defaultTicTacToeGame();
  expect(game.lookup(0)).toBe(null);
  game.check(0);
  expect(game.lookup(0)).toStrictEqual(new Move('X', 0));
  
  expect(game.lookup(1)).toBe(null);
  game.check(1);
  expect(game.lookup(1)).toStrictEqual(new Move('O', 1));
});

it('lookup with bad position', () => { 
  const game = defaultTicTacToeGame();
  expect(() => {
    game.lookup(-1);
  }).toThrow(RangeError);
  expect(() => {
    game.lookup(MAX_POSITION + 1);
  }).toThrow(RangeError);
});

it('winner vertical', () => { 
  const positions = [
    //X  O
    //X: 0 3 6
    [
      7, 8,
      0, 1,
      3, 2,
      6
    ], 
    //X: 1 4 7
    [
      8, 3,
      1, 2,
      4, 5,
      7
    ], 
    //X: 2 5 8
    [ 
      1, 6,
      2, 3,
      5, 4,
      8
    ]
  ];
  positions.forEach(pos => {
    const game = defaultTicTacToeGame();
    pos.forEach(p => {
      game.check(p);
    });
    expect(game.getWinner()).toStrictEqual(new Winner('X', 'vertical'));
  });
});

it('winner horizontal', () => { 
  const positions = [
    //X  O
    //X: 0 1 2
    [
      5, 6,
      0, 3,
      1, 4,
      2,
    ], 
    //X: 3 4 5
    [
      7, 8,
      3, 1,
      4, 2,
      5
    ], 
    //X: 6 7 8
    [
      3, 0,
      6, 1,
      7, 4,
      8,
    ]
  ];
  positions.forEach(pos => {
    const game = defaultTicTacToeGame();
    pos.forEach(p => {
      game.check(p);
    });
    expect(game.getWinner()).toStrictEqual(new Winner('X', 'horizontal'));
  });
});


it('winner diagonal left right', () => { 
  const positions = [
    //X  O
    //X: 0 4 8
    [
      5, 6,
      0, 1,
      4, 2,
      8,
    ],
  ];
  positions.forEach(pos => {
    const game = defaultTicTacToeGame();
    pos.forEach(p => {
      game.check(p);
    });
    expect(game.getWinner()).toStrictEqual(new Winner('X', 'diagonal left right'));
  });
});

it('winner diagonal right left', () => { 
  const positions = [
    //X  O
    //X: 0 4 8
    [
      5, 8,
      2, 1,
      4, 7,
      6,
    ],
  ];
  positions.forEach(pos => {
    const game = defaultTicTacToeGame();
    pos.forEach(p => {
      game.check(p);
    });
    expect(game.getWinner()).toStrictEqual(new Winner('X', 'diagonal right left'));
  });
});