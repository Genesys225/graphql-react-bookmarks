import React, { createContext, useReducer } from "react";
import rootReducer, { initialState } from "./rootReducer";

export const State = createContext();
export const Dispatch = createContext();

const Store = props => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const { children } = props;
  return (
    <State.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </State.Provider>
  );
};

export default Store;
