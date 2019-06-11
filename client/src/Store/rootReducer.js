import combineReducers from "./combineReducers";
import { fileInputReducer, fileInputInitialState } from "../components/Form/Form";

/** using combineReducers */
const rootReducer = combineReducers({
  fileInputState: fileInputReducer
});

export default rootReducer;

const combineInitialStates = (...rest) => Object.assign(...rest);

export const initialState = combineInitialStates({ fileInputState: fileInputInitialState });
