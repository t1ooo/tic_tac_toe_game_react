'use strict';

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "../src/App";

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders Info with or without winner", () => {
  act(() => {
    render(<Info winner=null nextPlayer="$Name"/>, container);
  });
  expect(container.textContent).toBe("Next player: $Name");
  
  act(() => {
    render(<Info winner={winner:"$winner",type:"$type"} nextPlayer="Name"/>, container);
  });
  expect(container.textContent).toBe("Winner: $winner / $type");
});