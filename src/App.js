// game https://cdpn.io/gaearon/fullpage/gWWZgR?editors=0010
// game + code https://codepen.io/gaearon/pen/gWWZgR?editors=0010

'use strict';

import React from 'react';
import logo from './logo.svg';
import './App.css';
import {TicTacToeGame} from './TicTacToeGame';

function clone(original) {
  return Object.assign(Object.create(original), original);
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
          {this.table(this.size)}
          <div>
            {this.playerInfo()}
            <div>
              <li key={Math.random()}>
                <button onClick={this.goToMove.bind(this, 0)}>Go to game start</button>
              </li>
              {this.getMoves().map((v,k)=>
                <li key={Math.random()}>
                  <button onClick={this.goToMove.bind(this, k+1)}>
                    Go to move {k+1}: p{v.position} = {v.player}
                  </button>
                </li>
              )}
            </div>
          </div>
      </div>
    );
  }

  playerInfo() {
    const winner = this.getWinner();
    return (winner === null)
      ? <div>Next player: {this.getNextPlayer()}</div>
      : <div>Winner: {winner.player} / {winner.type}</div>;
  }

  table(size) {
    return (
      <table className="App-table">
          <tbody>
            {arrayRange(0, size, size).map(x => {
                return (
                  <tr key={Math.random()}>
                    {arrayRange(0, 1, size).map(y =>
                      <td
                        key={Math.random()}
                        position={x+y}
                        onClick={this.check.bind(this, x+y)}
                      >
                        {this.lookup(x+y)}
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
