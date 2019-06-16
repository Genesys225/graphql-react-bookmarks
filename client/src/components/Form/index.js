import fileInputReducer, { fileInputInitialState } from "./FormField/FileInput/fileInputReducer";
import formReducer, { formInitialState } from "./formReducer";
import FormStore, { State, Dispatch } from "./Store";
import React from "react";
import Form from "./Form";

/** @type {React.component} - Form framework component wrapped with it's store provider  */
const FormWithStore = props => (
  <FormStore>
    <Form {...props} />
  </FormStore>
);
export default FormWithStore;
export { fileInputReducer, fileInputInitialState, formReducer, formInitialState };
export { FormField } from "./FormField/FormField";
export { Form };
/** @type {React.component} - to be used with this Form framework child
 *  @description After form is initiated it will proved
 */
export const formStore = { FormStore, State, Dispatch };
