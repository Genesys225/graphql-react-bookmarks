import { camelize } from "../../../utils/utilities";
import React, { useContext } from "react";
import FileInput from "./FileInput/FileInput";
import { State, Dispatch, formActions } from "../Store";
const { types } = formActions;
/** @type {React.component}
 * @description to be used with Form framework  */
export const FormField = props => {
  const fieldName = camelize(props.children.toString());
  const dispatch = useContext(Dispatch);
  const { formState } = useContext(State);
  const { inputFields } = formState;
  const state = inputFields[props.index];
  const validate = fieldTarget => dispatch({ type: types.setField, fieldName, fieldTarget });

  const { error, fieldAttributes } = state;
  const handleChange = ({ target }) => validate(target);

  const handleBlur = ({ target }) => {
    dispatch({ type: types.setFirstBlur, payload: true });
    validate(target);
  };

  if (!fieldAttributes) return null;
  const { title } = fieldAttributes;

  const filteredAttributes = { ...fieldAttributes }; // filterObject(fieldAttributes, "title");
  delete filteredAttributes.title;
  filteredAttributes.onChange = handleChange;
  filteredAttributes.onBlur = handleBlur;
  /** switch statement for special fields, defaults
   * to a turnery of regular input or text area
   * @returns {React.component || HTML}
   */
  switch (filteredAttributes.type) {
    case "file":
      /** additional parent props to be used by field elements */
      const parentProps = {
        title,
        error,
        fieldName,
        onConfirm: props.onConfirm
      };
      return <FileInput fieldAttributes={filteredAttributes} parentProps={parentProps} />;
    default:
      return (
        <div className="form-group mb-3">
          <label htmlFor={fieldName}>{title ? title : null}</label>
          {props.rows ? (
            <textarea {...filteredAttributes} rows={props.rows} />
          ) : (
            <input {...filteredAttributes} />
          )}
          <div className="invalid-feedback m-0" style={{ height: "0px" }}>
            {error}
          </div>
        </div>
      );
  }
};
