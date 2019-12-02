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
    };
  }
  
  render() {
    return (
      <div className="App">
          {this.table(3, 3)}
          <div>
            Next player: {this.state.player}
          </div>
      </div>
    );
  }
  
  table(x, y) {
    return (<table className="App-table">
        <tbody>
          {[...Array(x)].map((_, xx) => 
            <tr key={xx}>
              {[...Array(y)].map((_, yy) => 
                <td x={x} y={y} key={''+x+y}></td>
              )}
            </tr>
          )}
        </tbody> 
    </table>);
  }
}

export default App;
