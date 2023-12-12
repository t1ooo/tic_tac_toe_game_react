// game https://cdpn.io/gaearon/fullpage/gWWZgR?editors=0010
// game + code https://codepen.io/gaearon/pen/gWWZgR?editors=0010

import React from 'react';
import './App.css';
import { TicTacToeGame, Move, Winner, GameOverError, CheckedError } from './TicTacToeGame';
import PropTypes from 'prop-types';

export class BoardItem extends React.Component {
  static propTypes = {
    check: PropTypes.func.isRequired,
    lookup: PropTypes.func.isRequired,
  };

  render () {
    return (
      <div className="board-item"
        onClick={this.props.check}
      >
        {this.props.lookup()}
      </div>
    );
  }
}

export class Board extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    check: PropTypes.func.isRequired,
    lookup: PropTypes.func.isRequired,
  };

  render () {
    const size = this.props.size;
    return (
      <table>
          <tbody>
            {arrayRange(0, size, size).map(x => this._tr(x))}
          </tbody>
      </table>
    );
  }

  _tr(x) {
    const size = this.props.size;
    return (
      <tr
        key={x}
      >
        {arrayRange(0, 1, size).map(y => this._td(x+y))}
      </tr>
    );
  }

  _td(position) {
    return (
      <td
        key={position}
      >
        <BoardItem
          check={_ => this.props.check(position)}
          lookup={_ => this.props.lookup(position)}
        />
      </td>
    );
  }
}

export class HistoryItem extends React.Component {
  static propTypes = {
    goToMove: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
  };

  render() {
    return (
      <button className="history-item" onClick={this.props.goToMove}>
        {this.props.content}
      </button>
    );
  }
}

export class History extends React.Component {
  static propTypes = {
    moves: PropTypes.arrayOf(PropTypes.instanceOf(Move)).isRequired,
    goToMove: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <li key={0}>
          <HistoryItem
            goToMove={_ => this.props.goToMove(0)}
            content="Go to game start"
          />
        </li>
        {this.props.moves.map((v,k) =>
          <li key={k+1}>
            <HistoryItem
              goToMove={_ => this.props.goToMove(k+1)}
              content={`Go to move ${k+1}: p${v.position} = ${v.player}`}
            />
          </li>
        )}
      </div>
    );
  }
}

export class Info extends React.Component {
  static propTypes = {
    winner: PropTypes.instanceOf(Winner),
    nextPlayer: PropTypes.string.isRequired,
  };

  render() {
    const winner = this.props.winner;
    const content = (winner === null)
      ? `Next player: ${this.props.nextPlayer}`
      : `Winner: ${winner.player} / ${winner.type}`;
    return (
      <div className="info">{content}</div>
    );
  }
}

export class App extends React.Component {
  static propTypes = {
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 3,
  };

  constructor(props) {
    super(props);
    this.state = {
      game: new TicTacToeGame(props.size),
    };
  }

  render() {
    return (
      <div className="App">
          <Board
            size={this.props.size}
            check={i => this._check(i)}
            lookup={i => this._lookup(i)}
          />
          <div>
            <Info
              winner={this._getWinner()}
              nextPlayer={this._getNextPlayer()}
            />
            <History
              goToMove={i => this._goToMove(i)}
              moves={this._getMoves()}
            />
          </div>
      </div>
    );
  }

  _getMoves() {
    return this.state.game.getMoves();
  }

  _getNextPlayer() {
    return this.state.game.getNextPlayer();
  }

  _getWinner() {
    return this.state.game.getWinner();
  }

  _lookup(position) {
    const move = this.state.game.lookup(position);
    if (move === null) {
      return '';
    }
    return move.player;
  }

  _goToMove(index) {
    this.setState((state, props) => {
      state.game.goToMove(index);
      return {game: state.game};
    });
  }

  _check(position) {
    console.log('check', position);
    this.setState((state, props) => {
      try {
        state.game.check(position);
        return {game: state.game};
      } catch(e) {
        switch(e.name) {
            case 'GameOverError':
            case 'CheckedError':
              console.log(e.message);
              break;
            default:
              throw e;
        }
      }
    });
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

/* export default App; */
