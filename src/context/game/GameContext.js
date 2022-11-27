import { createContext, useReducer } from "react";

import reducer from "./reducer";

import { initialState } from "./reducer";

export const GameContext = createContext(initialState);

export const GameContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
