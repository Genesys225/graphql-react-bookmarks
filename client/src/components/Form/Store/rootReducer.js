import combineReducers from "./combineReducers";
import fileInputReducer, { fileInputInitialState } from "../FormField/FileInput/fileInputReducer";
import formReducer, { formInitialState } from "../formReducer";

/** uses combineReducers */
const rootReducer = combineReducers({
  /** form state */
  formState: formReducer,
  fileInputState: fileInputReducer
});

export default rootReducer;

const combineInitialStates = (...rest) => Object.assign(...rest);

export const initialState = combineInitialStates({
  formState: formInitialState,
  fileInputState: fileInputInitialState
});
