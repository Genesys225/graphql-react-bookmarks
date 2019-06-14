import combineReducers from "./combineReducers";

/** using combineReducers */
const rootReducer = combineReducers({
  /** @interface { reducer_name: reducer} */
});

export default rootReducer;

const combineInitialStates = (...rest) => Object.assign(...rest);

export const initialState = combineInitialStates({
  /** @interface { reducer_name: initialState} */
});
