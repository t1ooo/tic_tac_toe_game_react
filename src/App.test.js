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
