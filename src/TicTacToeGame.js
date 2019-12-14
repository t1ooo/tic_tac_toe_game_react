/* board:
    0 1 2
    3 4 5
    6 7 8
*/

class Move {
  constructor(player, position) {
    this.player = player;
    this.position = position;
  }
}

class Winner {
  constructor(player, type) {
    this.player = player;
    this.type = type;
  }
}

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
  _getMovesWithIndex() {
    return this._moves.slice(0, this._index);
  }

  check(position) {
    if (position < 0 || this._getMaxPosition() < position) {
      throw new Error('bad position');
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
    this._moves = this._getMovesWithIndex();
  }

  _check(position, player) {
    this._moves.push(new Move(player, position));
    this._index++;
  }

  isChecked(position) {
    return (this.lookup(position) !== null);
  }

  getNextPlayer() {
    return this._index%2 === 1
      ? PlayerO
      : PlayerX;
  }

  lookup(position) {
    const moves = this._getMovesWithIndex();
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

    const moves = this._getMovesWithIndex();
    for(let i=0; i<moves.length; i++) {
      const move = moves[i];
      movesByPlayer[move.player].push(move.position);
      movesByPlayer[move.player].push(move.position);
    }

    for(let player in movesByPlayer) {
      const positions = movesByPlayer[player];

      console.log(positions);

      if (this._isVerticalWin(positions, this._size)) {
        return new Winner(player, 'vertical');
      }

      if (this._isHorisontalWin(positions, this._size)) {
        return new Winner(player, 'horizontal');
      }

      if (this._isDiagonalLeftRightWin(positions, this._size)) {
        return new Winner(player, 'diagonal left right');
      }

      if (this._isDiagonalRightLeftWin(positions, this._size)) {
        return new Winner(player, 'diagonal right left');
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
  TicTacToeGame: TicTacToeGame,
  Move: Move,
  Winner: Winner,
};