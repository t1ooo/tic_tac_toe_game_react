'use strict';

class Move {
  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
  }
}

class Winner {
  constructor(player, type) {
    this.player = player;
    this.type = type;
  }
}

const Player  = '';
const PlayerX = 'X';
const PlayerO = 'O';

class TicTacToeGame {
  constructor(size) {
    if (size < 0) {
      throw new Error('bad size');
    }
    this._size = size;
    this._player = '';
    this._moves = [];
    this._index = 0;
  }

  goToMove(index) {
    if (index < 0 || this._moves.length < index) {
      throw new Error('bad index');
    }
    this._index = index;
  }

  // return all moves
  getMoves() {
    return this._moves.slice(0);
  }

  /* TODO: change name? */
  // return all moves up to current index
  getMovesIndex() {
    return this._moves.slice(0, this._index);
  }

  getWinner() {}

  check(x,y) {
    if (x < 0 || this._size-1 < x) {
      throw new Error('bad x');
    }
    if (y < 0 || this._size-1 < y) {
      throw new Error('bad y');
    }
    if (this._moves.length !== this._index) {
      this._trucnateMoves();
    }
    if (this.getWinner() !== null) {
      throw new Error('game over');
    }
    if (this.isChecked(x,y)) {
      throw new Error('already checked');
    }
    const player = this.getNextPlayer();
    this._check(x, y, player);
  }

  _trucnateMoves() {
    this._moves = this.getMovesIndex();
  }

  _check(x, y, player) {
    this._moves.push(new Move(x, y, player));
    this._index++;
  }

  isChecked(x,y) {
    return (this.lookup(x,y) !== null);
  }

  getPlayer() {
    const moves = this.getMovesIndex();
    if (moves.length === 0) {
      return Player;
    }
    return moves[moves.length-1].player;
  }

  getNextPlayer() {
    switch(this.getPlayer()) {
      case Player  : return PlayerX;
      case PlayerO : return PlayerX;
      case PlayerX : return PlayerO;
      default      : throw Error('player not support');
    }
  }

  lookup(x,y) {
    const moves = this.getMovesIndex();
    for(let i=0; i<moves.length; i++) {
      const move = moves[i];
      if (x === move.x && y === move.y) {
        return move;
      }
    }
    return null;
  }

  /*
    vertical:              0 1, 0 2, ..., x   y+1
    horisontal:            0 0, 1 0, ..., x+1 y
    diagonal left right:   0 0, 1 1, ..., x+1 y+1
    diagonal right left:   3 0, 2 1, ..., x-1 y+1
  */
  getWinner() {
    const movesByPlayer = {};
    movesByPlayer[PlayerX] = {'x':[],'y':[]};
    movesByPlayer[PlayerO] = {'x':[],'y':[]};

    const moves = this.getMovesIndex();
    for(let i=0; i<moves.length; i++) {
      const move = moves[i];
      movesByPlayer[move.player]['x'].push(move.x);
      movesByPlayer[move.player]['y'].push(move.y);
    }

    const max = this._size-1;
    for(let player in movesByPlayer) {
      const g = movesByPlayer[player];

      console.log(g['x'], g['y']);

      if (this._isVerticalWin(g['x'], max)) {
          return new Winner(player, 'vertical');
      }

      if (this._isHorisontalWin(g['y'], max)) {
          return new Winner(player, 'horisontal');
      }

      if (this._isDiagonalLeftRightWin(g['x'], g['y'], max)) {
        return new Winner(player, 'diagonal lefr right');
      }

      if (this._isDiagonalRightLeftWin(g['x'], g['y'], max)) {
        return new Winner(player, 'diagonal right lefr');
      }
    }

    return null;
  }

  _isVerticalWin(xs, max) {
    return arrayCountVals(xs).some(v=>(v.count === max+1));
  }

  _isHorisontalWin(ys, max) {
    return this._isVerticalWin(ys, max);
  }

  _isDiagonalLeftRightWin(xs, ys, max) {
      for(let n=0; n<=max; n++) {
        if (
          xs.indexOf(n) === -1
          || ys.indexOf(n) === -1
          || arrayIntersectIndexOf(xs, ys, n) === -1
        ) {
          return false;
        }
      }
      return true;
  }

  _isDiagonalRightLeftWin(xs, ys, max) {
    return this._isDiagonalLeftRightWin(xs, arrayReverse(ys), max)
  }
}

function arrayUnique(arr) {
  return Array.from(new Set(arr));
}

function arraySort(arr) {
  const arrCopy = arr.slice();
  arrCopy.sort();
  return arrCopy;
}

function arrayReverse(arr) {
  const arrCopy = arr.slice();
  arrCopy.reverse();
  return arrCopy;
}

function arrayCountVal(arr, val) {
  return arr.filter(v=>(v===val)).length;
}

function arrayCountVals(arr) {
  return arrayUnique(arr).map(v=>({
      val: v,
      count: arrayCountVal(arr, v),
  }));
}

// return index of two arrays by value
function arrayIntersectIndexOf(first_arr, second_arr, val) {
  for(let i=0; i<=first_arr.length; i++) {
    if (first_arr[i] === val && second_arr[i] === val) {
      return i
    }
  }
  return -1;
}

module.exports = {
  TicTacToeGame:TicTacToeGame,
};