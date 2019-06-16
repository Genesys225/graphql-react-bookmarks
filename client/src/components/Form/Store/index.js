import React, { createContext, useReducer } from "react";
import rootReducer, { initialState } from "./rootReducer";
import { formActions, fileInputActions } from "./actionTypes";

export const State = createContext();
export const Dispatch = createContext();

const FormStore = props => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const { children } = props;
  return (
    <State.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </State.Provider>
  );
};

export default FormStore;
export { formActions, fileInputActions };
