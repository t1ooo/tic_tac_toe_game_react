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
      <div
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
            {arrayRange(0, size, size).map(x => this.tr(x))}
          </tbody>
      </table>
    );
  }

  tr(x) {
    const size = this.props.size;
    return (
      <tr
        key={x}
      >
        {arrayRange(0, 1, size).map(y => this.td(x+y))}
      </tr>
    );
  }

  td(position) {
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
      <button onClick={this.props.goToMove}>
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
    return (winner === null)
      ? <div>Next player: {this.props.nextPlayer}</div>
      : <div>Winner: {winner.player} / {winner.type}</div>;
  }
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.size = 3;
    this.state = {
      game: new TicTacToeGame(this.size),
    };
  }

  render() {
    return (
      <div className="App">
          <Board
            size={this.size}
            check={i => this.check(i)}
            lookup={i => this.lookup(i)}
          />
          <div>
            <Info
              winner={this.getWinner()}
              nextPlayer={this.getNextPlayer()}
            />
            <History
              goToMove={i => this.goToMove(i)}
              moves={this.getMoves()}
            />
          </div>
      </div>
    );
  }

  getMoves() {
    return this.state.game.getMoves();
  }

  getNextPlayer() {
    return this.state.game.getNextPlayer();
  }

  getWinner() {
    return this.state.game.getWinner();
  }

  lookup(position) {
    const move = this.state.game.lookup(position);
    if (move === null) {
      return '';
    }
    return move.player;
  }

  goToMove(index) {
    this.setState((state, props) => {
      try {
        state.game.goToMove(index);
        return {game: state.game};
      } catch(e) {
        console.log(e.message)
      }
    });
  }

  check(position) {
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
