import React from 'react';
import logo from './logo.svg';
import './App.css';

const Player  = {
  content: ''
}

const PlayerX  = {
  content: 'x'
}

const PlayerO = {
  content: 'o'
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        log:new Map(),
        player: PlayerX,
    };
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React and Fun
          </a>
          {/* <table className="App-table">
              <tbody>
                <tr>
                    {this.td(1)}
                    {this.td(2)}
                    {this.td(3)}
                </tr>
                <tr>
                    {this.td(4)}
                    {this.td(5)}
                    {this.td(6)}
                </tr>
                <tr>
                    {this.td(7)}
                    {this.td(8)}
                    {this.td(9)}
                </tr>
              </tbody>
          </table> */}
          {this.table(3, 3)}
          <div ref="log">
            <ul>
              {/*this.state.log.forEach((v,k) => (<li key={Math.random()}>{v} - {k}</li>))*/}
              {this.state.log}
            </ul>
          </div>
        </header>
      </div>
    );
  }
  
  table(x, y) {
    return (<table className="App-table">
        <tbody>
          {[...Array(x)].map((_, xx) => 
            <tr key={xx}>
              {[...Array(y)].map((_, yy) => this.td(xx, yy))}
            </tr>
          )}
        </tbody>
    </table>);
  }
  
  td(x, y) {
    /* return <td x={x} y={y} key={''+x+y} onClick={this.test.bind(this, x, y)}>{content}</td>; */
    /* return <td x={x} y={y} key={''+x+y} onClick={()=>this.test(x,y)}>{this.state.player.content}</td>; */
    return <td x={x} y={y} key={''+x+y} onClick={()=>this.test(x,y)}>{this.state.log.get(`${x}:${y}`)}</td>;
  }
  
  test(x, y) {
    console.log(x,y);
    /* this.state.log.push(content); */
    /* return this.setState({
      log: log.concat(content),
    }); */
    /* this.setState((state, props) => {
      return {log: state.log.concat(x+':'+y)};
    }); */
    /* console.log(this.refs.log); */
    this.log(x,y);
    this.changePlayer(x,y);
  }
  
  log(x,y) {
    this.setState((state, props) => {
      /* return {log: state.log.concat(x+':'+y)}; */
      /* return {log: state.log.concat(state.player)}; */
      if (state.log.has(`${x}:${y}`)) {
        return {};
      }
      const log = new Map(state.log); 
      log.set(`${x}:${y}`, state.player.content);
      return {log: log};
    });
  }
  
  changePlayer() {
    this.setState((state, props) => {
      return {player: this.getNextPlayer(state.player)};
    });
  }
  
  getNextPlayer(player) {
    /* if (player === Player) {
        return PlayerX;
    } */
    if (player === PlayerX) {
        return PlayerO;
    }
    if (player === PlayerO) {
        return PlayerX;
    }
  }
}

export default App;
