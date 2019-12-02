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
    };
  }

  render() {
    return (
      <div className="App">
          {this.table(3, 3)}
          <div>
            Next player: {this.state.player}
            <div>
              <li key={Math.random()}><button>Go to game start</button></li>
              {this.state.log.map((v,k)=>
                (<li key={Math.random()}><button>Go to move {k+1}: {v.x} {v.y} {v.player}</button></li>)
              )}
            </div>
          </div>
      </div>
    );
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
                    onClick={this.click.bind(this, xx, yy)}
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

  click(x,y) {
    this.writeToLog(x,y);
    this.changePlayer();
  }
  
  writeToLog(x, y) {
    this.setState((state, props) => {
      console.log('writeToLog', state.log);
      return {log: state.log.concat({x:x,y:y,player:this.state.player})};
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
    for(let v of this.state.log) {
      /* console.log(v); */
      if (v.x === x && v.y === y) {
        return v.player;
      }
    }
    return '';
  }
}

export default App;
