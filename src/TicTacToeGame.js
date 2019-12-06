'use strict';

/* board:
    0 1 2
    3 4 5
    6 7 8
*/

class Move {
  constructor(position, player) {
    this.position = position;
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

  check(position) {
    if (position < 0 || this._getMaxPosition() < position) {
      throw new Error('bad n');
    }
    if (this._moves.length !== this._index) {
      this._trucnateMoves();
    }
    if (this.getWinner() !== null) {
      throw new Error('game over');
    }
    if (this.isChecked(position)) {
      throw new Error('already checked');
    }
    const player = this.getNextPlayer();
    this._check(position, player);
  }

  _getMaxPosition() {
    return (this._size * this._size) - 1;
  }

  _trucnateMoves() {
    this._moves = this.getMovesIndex();
  }

  _check(position, player) {
    this._moves.push(new Move(position, player));
    this._index++;
  }

  isChecked(position) {
    return (this.lookup(position) !== null);
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

  lookup(position) {
    const moves = this.getMovesIndex();
    for(let i=0; i<moves.length; i++) {
      const move = moves[i];
      if (position === move.position) {
        return move;
      }
    }
    return null;
  }

  getWinner() {
    const movesByPlayer = {};
    movesByPlayer[PlayerX] = [];
    movesByPlayer[PlayerO] = [];

    const moves = this.getMovesIndex();
    for(let i=0; i<moves.length; i++) {
      const move = moves[i];
      movesByPlayer[move.player].push(move.position);
      movesByPlayer[move.player].push(move.position);
    }

    const max = this._size-1;
    for(let player in movesByPlayer) {
      const positions = movesByPlayer[player];

      console.log(positions);

      if (this._isVerticalWin(positions, this._size)) {
        return new Winner(player, 'vertical');
      }

      if (this._isHorisontalWin(positions, this._size)) {
        return new Winner(player, 'horisontal');
      }

      if (this._isDiagonalLeftRightWin(positions, this._size)) {
        return new Winner(player, 'diagonal lefr right');
      }

      if (this._isDiagonalRightLeftWin(positions, this._size)) {
        return new Winner(player, 'diagonal right lefr');
      }
    }

    return null;
  }

  _isHorisontalWin(positions, size) {
    return arrayRange(0, 1, size).some(rowNum=>
      arrayIncludesAll(positions, this._getRowVals(rowNum, size))
    );
  }

  _isVerticalWin(positions, size) {
    return arrayRange(0, 1, size).some(colNum=>
      arrayIncludesAll(positions, this._getColVals(colNum, size))
    );
  }

  _isDiagonalLeftRightWin(positions, size) {
    return arrayIncludesAll(positions, this._getDiagonalLeftRightVals(size))
  }

  _isDiagonalRightLeftWin(positions, size) {
    return arrayIncludesAll(positions, this._getDiagonalRightLeftVals(size))
  }

  _getRowVals(rowNum, size) {
    return arrayRange((rowNum*size), 1, size);
  }

  _getColVals(colNum, size) {
    return arrayRange(colNum, size, size);
  }

  _getDiagonalLeftRightVals(size) {
    return arrayRange(0, size+1, size);
  }

  _getDiagonalRightLeftVals(size) {
    return arrayRange(size-1, size-1, size);
  }
}

function arrayRange(start, step, length) {
  const arr = [];
  for(let i=0; i<length; i++) {
    arr.push(start);
    start+=step;
  }
  return arr
}

function arrayIncludesAll(arr, vals) {
  return vals.every(v=>arr.includes(v));
}

module.exports = {
  TicTacToeGame:TicTacToeGame,
};