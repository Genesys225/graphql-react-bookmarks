import combineReducers from "./combineReducers";
import fileInputReducer, { fileInputInitialState } from "../FormField/FileInput/fileInputReducer";
import formReducer, { formInitialState } from "../formReducer";

/** uses combineReducers */
const rootReducer = combineReducers({
  /** form state */
  Form: formReducer,
  fileInputState: fileInputReducer
});

export default rootReducer;

const combineInitialStates = (...rest) => Object.assign(...rest);

export const initialState = combineInitialStates({
  Form: formInitialState,
  fileInputState: fileInputInitialState
});
