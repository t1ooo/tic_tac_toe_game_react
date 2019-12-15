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

it('test App', () => { 
  const app = render(<App />, container);

  //expect(app.getNextPlayer()).toStrictEqual('X');
  //expect(app.state.game.getMoves()).toStrictEqual([new Move('X', 0)]);
  //expect(app.getNextPlayer()).toStrictEqual('O');
  //expect(app.lookup(0)).toStrictEqual('X');
  //expect(app.lookup(1)).toStrictEqual('');
  //expect(app.lookup(0)).toStrictEqual('');
  
  const info = () => container.querySelector('div[class="info"]');
  const boardItems = i => container.querySelectorAll('div[class="board-item"]').item(i);
  const historyItems = i => container.querySelectorAll('button[class="history-item"]').item(i);
  
  const clickBoardItem = i => {
    act(() => {
      boardItems(i).dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  };
  const clickHistoryItem = i => {
    act(() => {
      historyItems(i).dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  }; 
  const player = i => i%2===0 ?'X':'O';
  const nextPlayer = i => i%2===0 ?'O':'X';
  
  // check init condition
  expect(info().textContent).toBe('Next player: X');
  expect(boardItems(0).textContent).toBe('');
  expect(boardItems(1).textContent).toBe('');

  // check condition after click to board item
  clickBoardItem(0);
  expect(info().textContent).toBe('Next player: O');
  expect(boardItems(0).textContent).toBe('X');
  
  clickBoardItem(1);
  expect(info().textContent).toBe('Next player: X');
  expect(boardItems(1).textContent).toBe('O');
  
  // check condition after reclick to board item
  clickBoardItem(1);
  expect(info().textContent).toBe('Next player: X');
  expect(boardItems(1).textContent).toBe('O');
  

  // check condition after click to history item
  clickBoardItem(2);
  clickBoardItem(3);
  
  expect(info().textContent).toBe('Next player: X');
  expect(boardItems(0).textContent).toBe('X');
  expect(boardItems(1).textContent).toBe('O');
  expect(boardItems(2).textContent).toBe('X');
  expect(boardItems(3).textContent).toBe('O');
  
  clickHistoryItem(2);
  expect(info().textContent).toBe('Next player: X');
  expect(boardItems(0).textContent).toBe('X');
  expect(boardItems(1).textContent).toBe('O');
  expect(boardItems(2).textContent).toBe('');
  expect(boardItems(3).textContent).toBe('');
  
  clickHistoryItem(3);
  expect(info().textContent).toBe('Next player: O');
  expect(boardItems(0).textContent).toBe('X');
  expect(boardItems(1).textContent).toBe('O');
  expect(boardItems(2).textContent).toBe('X');
  expect(boardItems(3).textContent).toBe('');
  
  // check condition after win
  clickHistoryItem(0);
  clickBoardItem(0); clickBoardItem(1);
  clickBoardItem(3); clickBoardItem(2);
  clickBoardItem(6); clickBoardItem(4);
  expect(info().textContent).toBe('Winner: X / vertical');
  expect(boardItems(4).textContent).toBe('');
  
  //
  expect(() => {
    app.check(10);
  }).toThrow(RangeError);
  
  //clickHistoryItem(1);
  //expect(boardItems(1).textContent).toBe('O');
  //expect(info().textContent).toBe('Next player: O');
  //expect(boardItems(1).textContent).toBe('');
  
/*   clickHistoryItem(2); 
  expect(info().textContent).toBe('Next player: X');
  expect(boardItems(0).textContent).toBe('O'); */
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
