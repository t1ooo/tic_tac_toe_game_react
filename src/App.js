// game https://cdpn.io/gaearon/fullpage/gWWZgR?editors=0010
// game + code https://codepen.io/gaearon/pen/gWWZgR?editors=0010

'use strict';

import React from 'react';
import logo from './logo.svg';
import './App.css';
import {TicTacToeGame, Move, Winner} from './TicTacToeGame';
import PropTypes from 'prop-types';

function clone(original) {
  return Object.assign(Object.create(original), original);
}

class Board extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    check: PropTypes.func.isRequired,
    lookup: PropTypes.func.isRequired,
  };
  render () {
    const size = this.props.size;
    return (
      <table className="App-table">
          <tbody>
            {arrayRange(0, size, size).map(x => {
                return (
                  <tr key={x}>
                    {arrayRange(0, 1, size).map(y =>
                      <td
                        key={x+y}
                        position={x+y}
                        onClick={i=>this.props.check(x+y)}
                      >
                        {this.props.lookup(x+y)}
                      </td>
                    )}
                  </tr>
                );
              }
            )}
          </tbody>
      </table>
    );
  }
}

class History extends React.Component {
  static propTypes = {
    moves: PropTypes.arrayOf(PropTypes.instanceOf(Move)).isRequired,
    goToMove: PropTypes.func.isRequired,
  };
  render() {
    return (
      <div>
        <li key={0}>
          <button onClick={i=>this.props.goToMove(0)}>Go to game start</button>
        </li>
        {this.props.moves.map((v,k)=>
          <li key={k+1}>
            <button onClick={i=>this.props.goToMove(k+1)}>
              Go to move {k+1}: p{v.position} = {v.player}
            </button>
          </li>
        )}
      </div>
    );
  }
}

class Info extends React.Component {
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

class App extends React.Component {
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
            check={i=>this.check(i)}
            lookup={i=>this.lookup(i)}
          />
         <div>
            <Info
              winner={this.getWinner()}
              nextPlayer={this.getNextPlayer()}
            />
            <History
              goToMove={i=>this.goToMove(i)}
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
    return this.state.game.lookup(position).player;
  }

  goToMove(index) {
    this.setState((state, props) => {
      try {
        const game = clone(state.game);
        game.goToMove(index);
        return {game: game};
      } catch(e) {
        console.log(e.message)
      }
    });
  }

  check(position) {
    console.log('check', position);
    this.setState((state, props) => {
      try {
        const game = clone(state.game);
        game.check(position);
        return {game: game};
      } catch(e) {
        console.log(e.message)
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

export default App;
