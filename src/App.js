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
    return (
      <div className="App">
          {this.table(3, 3)}
          <div>
            Next player: {this.state.player}
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
      console.log('changeLogStateIndex', this.getCellIndex(x,y));
      return {logStateIndex: this.getCellIndex(x,y)};
    });
  }
  
  incrLogStateIndex(x,y) {
    this.setState((state, props) => {
      console.log('incrLogStateIndex', state.logStateIndex+1);
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

  markCell(x,y) {
    /* console.log(this.state.logStateIndex, this.state.log.length); */
    if (this.state.logStateIndex !== this.state.log.length) {
      this.truncateLog(this.state.logStateIndex+1);
      console.log('truncate', this.state.logStateIndex, this.state.log.length);
    }
    if (this.getCellContent(x,y) !== '') {
      return;
    }
    this.incrLogStateIndex(x,y);
    this.writeToLog(x,y);
    this.changePlayer();
  }
  
  writeToLog(x, y) {
    this.setState((state, props) => {
      console.log('writeToLog', state.log);
      return {log: state.log.concat({x:x,y:y,player:this.state.player})};
    });
  }
  
  truncateLog(size) {
    this.setState((state, props) => {
      console.log('truncateLog', size);
      return {log: state.log.slice(0, size)};
    });
  }

  changePlayer() {
    console.log('changePlayer');
    const players = {
      'x':'o',
      'o':'x',
    };
    this.setState((state, props) => {
      return {player: players[state.player]};
    });
  }
  
  getCellContent(x,y) {
    //for(let v of this.state.log) {
    for(let i=0; i<this.state.log.length; i++) {
      const v = this.state.log[i];
      /* console.log(v); */
      if (v.x === x && v.y === y && i <= this.state.logStateIndex) {
        return v.player;
      }
    }
    return '';
  }
  
  getCellIndex(x,y) {
    //for(let [k,v] of this.state.log) {
    for(let i=0; i<this.state.log.length; i++) {
      const v = this.state.log[i];
      if (v.x === x && v.y === y) {
        return i;
      }
    }
    return -1;
  }
}

export default App;
