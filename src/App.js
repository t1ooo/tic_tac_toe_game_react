// game https://cdpn.io/gaearon/fullpage/gWWZgR?editors=0010
// game + code https://codepen.io/gaearon/pen/gWWZgR?editors=0010

import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: 'x',
      log: [],
      logStateIndex: 0,
    };
  }

  render() {
    const winner = this.isWin(3);
    const info = (winner === '') 
      ? <div>Next player: {this.state.player}</div>
      : <div>Winner: {winner}</div>;
    return (
      <div className="App">
          {this.table(3, 3)}
          <div>
            {info}
            <div>
              <li key={Math.random()}>
                <button onClick={this.changeLogStateIndex.bind(this, -1, -1)}>Go to game start</button>
              </li>
              {this.state.log./* slice(this.state.logStateIndex). */map((v,k)=>
                <li key={Math.random()}>
                  <button onClick={this.changeLogStateIndex.bind(this, v.x, v.y)}>
                    Go to move {k+1}: {v.x} {v.y} {v.player}
                  </button>
                </li>
              )}
            </div>
          </div>
      </div>
    );
  }
  
  changeLogStateIndex(x,y) {
    this.setState((state, props) => {
      const logStateIndex = this._getCellIndex(x, y, state.log);
      const player = (logStateIndex === -1)
        ? 'x'
        : this.nextPlayer(state.log[logStateIndex].player);
      console.log('changeLogStateIndex:', logStateIndex);
      return {
        logStateIndex: logStateIndex,
        player: player,
      };
    });
  }
  
  incrLogStateIndex(x,y) {
    this.setState((state, props) => {
      console.log('incrLogStateIndex:', state.logStateIndex+1);
      return {logStateIndex: state.logStateIndex+1};
    });
  }

  table(x, y) {
    return (<table className="App-table">
        <tbody>
          {[...Array(x)].map((_, xx) => {
              /* {console.log(xx);} */
              return (<tr key={Math.random()}>
                {[...Array(y)].map((_, yy) =>
                  <td
                    key={Math.random()} 
                    onClick={this.markCell.bind(this, xx, yy)}
                    >
                    {this.getCellContent(xx, yy)}
                  </td>
                )}
              </tr>);
            }
          )}
        </tbody>
    </table>);
  }
  
  /* 
    vertical:              0 1, 0 2, ..., x   y+1
    horisontal:            0 0, 1 0, ..., x+1 y
    diagonal left right:   0 0, 1 1, ..., x+1 y+1
    diagonal right left:   3 0, 2 1, ..., x-1 y+1
  */
  _isWin(size, log, logStateIndex) {
    const group = {
        'x':{'x':[],'y':[]},
        'o':{'x':[],'y':[]},
    }
    for(let i=0; i<log.length && i <= logStateIndex; i++) {
      const v = log[i];
      /* group[v.player] = {v.x, v.x}; */
      group[v.player]['x'].push(v.x);
      group[v.player]['y'].push(v.y);
    }

    function isAllEqual(arr) {
      return (
        arr.length !== 0
        && arr.every(v=>(v === arr[0]))
      );
    }
    
    function isAllIncr(arr, max) {
      for(let i=0; i<=max; i++) {
        if (arr.indexOf(i) === -1) {
          return false;
        }
      }
      return true;
    }
    
    function isDiagonalLeftRightWin(xs, ys, max) {
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
    
    function isDiagonalRightLeftWin(xs, ys, max) {
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
    
    for(let player in group) {  
      const gr = group[player];
      
      //console.log('isWin v', isAllEqual(gr['x']), isAllIncr(gr['y'], size-1), size-1, gr['x'], gr['y']);
      //console.log('isWin h', isAllEqual(gr['y']), isAllIncr(gr['x'], size-1), size-1, gr['x'], gr['y']);
      
      // vertical
      if (
        isAllEqual(gr['x'])
        && isAllIncr(gr['y'], size-1)
      ) {
          console.log('isWin:', 'vartical', player);
          return player;
      }
      
      // horisontal
      if (
        isAllEqual(gr['y']) 
        && isAllIncr(gr['x'], size-1)
      ) {
          console.log('isWin:', 'horisontal', player);
          return player;
      }
      
      // diagonal lefr right
      if (isDiagonalLeftRightWin(gr['x'], gr['y'], size-1)) {
          console.log('isWin:', 'diagonal lefr right', player);
          return player;
      }
      
      // diagonal right lefr
      if (isDiagonalRightLeftWin(gr['x'], gr['y'], size-1)) {
          console.log('isWin:', 'diagonal right lefr', player);
          return player;
      }
    }
    
    return '';
  }

  isWin(size, state) {
    return this._isWin(size, this.state.log, this.state.logStateIndex);
  }

  //markCell(x,y) {
  //  /* console.log(this.state.logStateIndex, this.state.log.length); */
  //  // mark after select state
  //  if (this.state.logStateIndex !== this.state.log.length) {
  //    this.truncateLog(this.state.logStateIndex+1);
  //    //this.truncateLog(this.state.logStateIndex+2);
  //    //console.log('truncate:', this.state.logStateIndex, this.state.log.length);
  //  }
  //  // already market
  //  if (this.getCellContent(x,y) !== '') {
  //    return;
  //  }
  //  // someone won
  //  if (this.isWin(3) !== '') {
  //    return;
  //  }
  //  this.incrLogStateIndex(x,y);
  //  this.writeToLog(x,y);
  //  this.changePlayer();
  //}
  
  markCell(x,y) {
    this.setState((state, props) => {     
      let log = state.log;
      let logStateIndex = state.logStateIndex;
      let player = state.player;
      
      // mark after select state
      if (logStateIndex !== log.length) {
        log = log.slice(0, logStateIndex+1);
      }
      // already market
      if (this._getCellContent(x,y, log, logStateIndex) !== '') {
        return;
      }
      // someone won
      if (this._isWin(3, log, logStateIndex) !== '') {
        return;
      }
      //this.incrLogStateIndex(x,y);
      logStateIndex+=1;
      //this.writeToLog(x,y);
      log = log.concat({x:x,y:y,player:player});
      //this.changePlayer();
      player = this.nextPlayer(player);
      
      return {
        logStateIndex: logStateIndex,
        log: log,
        player: player,
      };
    });
  }
  
  writeToLog(x, y) {
    this.setState((state, props) => {
      console.log('writeToLog:', state.log);
      return {log: state.log.concat({x:x,y:y,player:this.state.player})};
    });
  }
  
  truncateLog(size) {
    this.setState((state, props) => {
      console.log('truncateLog:', size);
      return {log: state.log.slice(0, size)};
    });
  }

  changePlayer() {
    this.setState((state, props) => {
      const player = this.nextPlayer(state.player);
      console.log('changePlayer:', player);
      return {player: player};
    });
  }
  
  nextPlayer(prevPlayer) {
    const players = {
      'x':'o',
      'o':'x',
      '' :'x',
    };
    return players[prevPlayer];
  }
  
  getCellContent(x,y) {
    return this._getCellContent(x,y, this.state.log, this.state.logStateIndex);
  }
  
  _getCellContent(x,y, log, logStateIndex) {
    //for(let v of this.state.log) {
    //for(let i=0; i<log.length; i++) {
    for(let i=0; i<log.length && i <= logStateIndex; i++) {
      const v = log[i];
      /* console.log(v); */
      //if (v.x === x && v.y === y && i <= logStateIndex) {
      if (v.x === x && v.y === y) {
        return v.player;
      }
    }
    return '';
  }
  
  _getCellIndex(x, y, log) {
    //for(let [k,v] of this.state.log) {
    for(let i=0; i<log.length; i++) {
      const v = log[i];
      if (v.x === x && v.y === y) {
        return i;
      }
    }
    return -1;
  }
  
  getCellIndex(x,y) {
    return this._getCellIndex(x, y, this.state.log);
  }
}

export default App;
