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
              <li><button>Go to game start</button></li>
              {this.state.log.map((v,i)=>
                (<li><button>Go to move {i+1}: {v}</button></li>)
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
                  <td x={x} y={y} key={Math.random()} onClick={this.click.bind(this, x, y)}></td>
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
      return {log: state.log.concat([[x,y,this.state.player]])};
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
}

export default App;
