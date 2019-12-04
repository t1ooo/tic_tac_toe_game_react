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
    //return this._moves[this._index].player;
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

      // vertical
      if (this._isVerticalWin(g['x'], g['y'], max)) {
          return new Winner(player, 'vertical');
      }
      
      // horisontal
      if (this._isHorisontalWin(g['x'], g['y'], max)) {
          return new Winner(player, 'horisontal');
      }
      
      // diagonal lefr right
      if (this._isDiagonalLeftRightWin(g['x'], g['y'], max)) {
        return new Winner(player, 'diagonal lefr right');
      }
      
      // diagonal right lefr
      if (this._isDiagonalRightLeftWin(g['x'], g['y'], max)) {
        return new Winner(player, 'diagonal right lefr');
      }
    }
    
    return null;
  }
  
  _isVerticalWin(xs, ys, max) {
    return (
        this._isAllEqual(xs)
        && this._isAllIncr(ys, max)
    );
  }
  
  _isHorisontalWin(xs, ys, max) {
    return (
        this._isAllEqual(ys)
        && this._isAllIncr(xs, max)
    );
  }
  
  _isAllEqual(arr) {
    return (
      arr.length !== 0
      && arr.every(v=>(v === arr[0]))
    );
  }
  
  _isAllIncr(arr, max) {
    for(let i=0; i<=max; i++) {
      if (arr.indexOf(i) === -1) {
        return false;
      }
    }
    return true;
  }
  
  _isDiagonalLeftRightWin(xs, ys, max) {
    for(let i=0; i<=max; i++) {
      if (
        xs.indexOf(i) === -1  
        || ys.indexOf(i) === -1 
        || xs.indexOf(i) !== ys.indexOf(i)
      ) {
        return false;
      }
    }
    return true;
  }
  
  _isDiagonalRightLeftWin(xs, ys, max) {
    for(let i=0,j=max; i<=max; i++,j--) {
      if (
        xs.indexOf(i) === -1  
        || ys.indexOf(j) === -1 
        || xs.indexOf(i) !== ys.indexOf(j)
      ) {
        return false;
      }
    }
    return true;
  }
}

module.exports = {
  TicTacToeGame:TicTacToeGame,
};