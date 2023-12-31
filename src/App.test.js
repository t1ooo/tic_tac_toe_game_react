'use strict';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
/* import { shallow } from 'enzyme'; */
import { act } from 'react-dom/test-utils';

import { App, BoardItem, Info, HistoryItem, History } from './App';
import { Move, Winner, TicTacToeGame } from './TicTacToeGame';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('App', () => {
  render(<App />, container);
});

it('App: custom size', () => {
  render(<App size={4}/>, container);
});

it('App: init cond', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  expect(ath.getInfo().textContent).toBe('Next player: X');
  for (let i=0; i<3*3; i++) {
    expect(ath.getBoardItem(i).textContent).toBe('');
  }
});

it('App: click to board item: next player must change', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  expect(ath.getInfo().textContent).toBe('Next player: O');

  ath.clickBoardItem(1);
  expect(ath.getInfo().textContent).toBe('Next player: X');
});

it('App: click to board item: content', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  expect(ath.getBoardItem(0).textContent).toBe('X');

  ath.clickBoardItem(1);
  expect(ath.getBoardItem(1).textContent).toBe('O');
});

it('App: double click to board item: next player must not change', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  expect(ath.getInfo().textContent).toBe('Next player: O');

  ath.clickBoardItem(0);
  expect(ath.getInfo().textContent).toBe('Next player: O');
});

it('App: double click to board item: content must not be change', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  expect(ath.getBoardItem(0).textContent).toBe('X');
  
  ath.clickBoardItem(0);
  expect(ath.getBoardItem(0).textContent).toBe('X');
});

it('App: click to board item: history item must be add', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);
  
  expect(ath.getHistoryItems().length).toBe(1);
  
  ath.clickBoardItem(0);
  expect(ath.getHistoryItems().length).toBe(2);
  
  ath.clickBoardItem(1);
  expect(ath.getHistoryItems().length).toBe(3);
});

it('App: double click to board item: history item must not be add', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  ath.clickBoardItem(0);
  expect(ath.getHistoryItems().length).toBe(2);
});

it('App: click to history item: check next player', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  ath.clickBoardItem(1);
  ath.clickBoardItem(2);

  ath.clickHistoryItem(0);
  expect(ath.getInfo().textContent).toBe('Next player: X');

  ath.clickHistoryItem(1);
  expect(ath.getInfo().textContent).toBe('Next player: O');

  ath.clickHistoryItem(2);
  expect(ath.getInfo().textContent).toBe('Next player: X');

  ath.clickHistoryItem(3);
  expect(ath.getInfo().textContent).toBe('Next player: O');
});

it('App: click to history item: check board item content', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  ath.clickBoardItem(1);
  ath.clickBoardItem(2);

  ath.clickHistoryItem(0);
  expect(ath.getBoardItem(0).textContent).toBe('');
  expect(ath.getBoardItem(1).textContent).toBe('');
  expect(ath.getBoardItem(2).textContent).toBe('');

  ath.clickHistoryItem(1);
  expect(ath.getBoardItem(0).textContent).toBe('X');
  expect(ath.getBoardItem(1).textContent).toBe('');
  expect(ath.getBoardItem(2).textContent).toBe('');

  ath.clickHistoryItem(2);
  expect(ath.getBoardItem(0).textContent).toBe('X');
  expect(ath.getBoardItem(1).textContent).toBe('O');
  expect(ath.getBoardItem(2).textContent).toBe('');

  ath.clickHistoryItem(3);
  expect(ath.getBoardItem(0).textContent).toBe('X');
  expect(ath.getBoardItem(1).textContent).toBe('O');
  expect(ath.getBoardItem(2).textContent).toBe('X');
});

it('App: game over: check info', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0); ath.clickBoardItem(1);
  ath.clickBoardItem(3); ath.clickBoardItem(2);
  ath.clickBoardItem(6);

  expect(ath.getInfo().textContent).toBe('Winner: X / vertical');
});

it('App: game over: click must not work', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0); ath.clickBoardItem(1);
  ath.clickBoardItem(3); ath.clickBoardItem(2);
  ath.clickBoardItem(6);

  ath.clickBoardItem(4);
  ath.clickBoardItem(5);

  expect(ath.getBoardItem(4).textContent).toBe('');
  expect(ath.getBoardItem(5).textContent).toBe('');
});

class AppTestHelper {
  constructor(container) {
    this.container = container;
  }

  getInfo() {
    return this.container.querySelector('div[class="info"]');
  }

  getBoardItems() {
    return this.container.querySelectorAll('div[class="board-item"]');
  }

  getHistoryItems() {
    return this.container.querySelectorAll('button[class="history-item"]');
  }

  getBoardItem(i) {
    return this.getBoardItems().item(i);
  }

  getHistoryItem(i) {
    return this.getHistoryItems().item(i);
  }

  clickBoardItem(i) {
    this.click(this.getBoardItem(i));
  }

  clickHistoryItem(i) {
    this.click(this.getHistoryItem(i));
  };

  click(el) {
    act(() => {
      el.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  }
}

it('BoardItem', () => {
  const position = '42';
  const check = jest.fn();
  const lookup = () => position;

  act(() => {
    render(
      <BoardItem
        check={check}
        lookup={lookup}
      />,
      container
    );
  });

  const div = container.querySelector('div');
  act(() => {
    div.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(check).toHaveBeenCalledTimes(1);
  expect(container.textContent).toBe(position);
});

it('HistoryItem', () => {
  const goToMove = jest.fn();
  const content = 'some content';

  act(() => {
    render(
      <HistoryItem
        goToMove={goToMove}
        content={content}
      />,
      container
    );
  });

  const button = container.querySelector('button');
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(goToMove).toHaveBeenCalledTimes(1);
  expect(container.textContent).toBe(content);
});

it('History', () => {
  const goToMove = jest.fn(x=>x);
  const moves = [new Move('X', 0), new Move('O', 0)];

  act(() => {
    render(
      <History
        goToMove={goToMove}
        moves={moves}
      />,
      container
    );
  });

  const buttons = container.querySelectorAll('button');
  act(() => {
    buttons.forEach(x=>
      x.dispatchEvent(new MouseEvent('click', {bubbles: true}))
    );
  });

  expect(goToMove).toHaveBeenCalledTimes(buttons.length);
  goToMove.mock.calls.forEach((call,i)=>
    expect(call[0]).toBe(i)
  );
  expect(buttons.length).toBe(moves.length + 1);
});

it('Info', () => {
  const nextPlayer = 'Name';
  act(() => {
    render(<Info winner={null} nextPlayer={nextPlayer}/>, container);
  });
  expect(container.textContent).toBe(`Next player: ${nextPlayer}`);

  const winner = new Winner('winner','type');
  act(() => {
    render(<Info winner={winner} nextPlayer='Name'/>, container);
  });
  expect(container.textContent).toBe(`Winner: ${winner.player} / ${winner.type}`);
});
