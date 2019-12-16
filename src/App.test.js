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

it('renders App', () => {
  render(<App />, container);
});

class AppTestHelper {
  constructor(container) {
    this.container = container;
  }

  getInfo() { 
    return this.container.querySelector('div[class="info"]'); 
  }
  
  getBoardItems(i) { 
    return this.container.querySelectorAll('div[class="board-item"]').item(i); 
  }
  
  getHistoryItems(i) { 
    return this.container.querySelectorAll('button[class="history-item"]').item(i); 
  }

  clickBoardItem(i) {
    act(() => {
      this.getBoardItems(i).dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  }
  
  clickHistoryItem(i) {
    act(() => {
      this.getHistoryItems(i).dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  };
}

it('test App init cond', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  expect(ath.getInfo().textContent).toBe('Next player: X');
  for (let i=0; i<3*3; i++) {
    expect(ath.getBoardItems(i).textContent).toBe('');
  }
});

it('test App after click to board item', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  expect(ath.getInfo().textContent).toBe('Next player: O');
  expect(ath.getBoardItems(0).textContent).toBe('X');

  ath.clickBoardItem(1);
  expect(ath.getInfo().textContent).toBe('Next player: X');
  expect(ath.getBoardItems(1).textContent).toBe('O');
});

it('test App after double click to board item', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  ath.clickBoardItem(0);
  expect(ath.getInfo().textContent).toBe('Next player: O');
  expect(ath.getBoardItems(0).textContent).toBe('X');
});

it('test App after click to history item', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0);
  ath.clickBoardItem(1);
  ath.clickBoardItem(2);

  ath.clickHistoryItem(0);
  expect(ath.getInfo().textContent).toBe('Next player: X');
  expect(ath.getBoardItems(0).textContent).toBe('');
  expect(ath.getBoardItems(1).textContent).toBe('');
  expect(ath.getBoardItems(2).textContent).toBe('');

  ath.clickHistoryItem(1);
  expect(ath.getInfo().textContent).toBe('Next player: O');
  expect(ath.getBoardItems(0).textContent).toBe('X');
  expect(ath.getBoardItems(1).textContent).toBe('');
  expect(ath.getBoardItems(2).textContent).toBe('');

  ath.clickHistoryItem(2);
  expect(ath.getInfo().textContent).toBe('Next player: X');
  expect(ath.getBoardItems(0).textContent).toBe('X');
  expect(ath.getBoardItems(1).textContent).toBe('O');
  expect(ath.getBoardItems(2).textContent).toBe('');

  ath.clickHistoryItem(3);
  expect(ath.getInfo().textContent).toBe('Next player: O');
  expect(ath.getBoardItems(0).textContent).toBe('X');
  expect(ath.getBoardItems(1).textContent).toBe('O');
  expect(ath.getBoardItems(2).textContent).toBe('X');
});

it('test App after detect winner: info', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0); ath.clickBoardItem(1);
  ath.clickBoardItem(3); ath.clickBoardItem(2);
  ath.clickBoardItem(6);

  expect(ath.getInfo().textContent).toBe('Winner: X / vertical');
});

it('test App after detect winner: clicks not work', () => {
  const app = render(<App />, container);
  const ath = new AppTestHelper(container);

  ath.clickBoardItem(0); ath.clickBoardItem(1);
  ath.clickBoardItem(3); ath.clickBoardItem(2);
  ath.clickBoardItem(6);

  ath.clickBoardItem(4);
  ath.clickBoardItem(5);

  // not clicked
  expect(ath.getBoardItems(4).textContent).toBe('');
  expect(ath.getBoardItems(5).textContent).toBe('');
});

it('renders BoardItem', () => {
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

it('renders HistoryItem', () => {
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

it('renders History', () => {
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

it('renders Info', () => {
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
