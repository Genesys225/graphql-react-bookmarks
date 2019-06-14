import { camelize } from "../../../utils/utilities";
import React, { useContext } from "react";
import FileInput from "./FileInput/FileInput";
import { State, Dispatch } from "../Store";
/** @type {React.component}
 * @description to be used with Form framework  */
export const FormField = props => {
  const fieldName = camelize(props.children.toString());
  const {
    Form: { [fieldName]: state }
  } = useContext(State);
  const dispatch = useContext(Dispatch);
  const validate = fieldTarget =>
    // this only returns errors if they are present else leaves error undefined
    dispatch({ type: "setFields", fieldName, fieldTarget });

  if (!state) return null;
  const { error, fieldAttributes } = state;
  const handleChange = ({ target }) => validate(target);

  const handleBlur = ({ target }) => {
    dispatch({ type: "setFirstBlur", payload: true });
    validate(target);
  };

  if (!fieldAttributes) return null;
  const { title } = fieldAttributes;

  const filteredAttributes = { ...fieldAttributes }; // filterObject(fieldAttributes, "title");
  delete filteredAttributes.title;
  filteredAttributes.onChange = handleChange;
  filteredAttributes.onBlur = handleBlur;

  //compares input.type equal to "number" or "range" and sets attributes and or defaults

  /** additional parent props to be consumed by field children
   * @type {React.props}
   */
  /** switch statement for special fields, defaults
   * to a turnery of regular input or text area
   * @return {React.component || HTML}
   */
  switch (filteredAttributes.type) {
    case "file":
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

/**
 * this is trying to deduce the input type from the passed tag body text
 * @param {String} - In tag text passed by the FormField, in the Form parent JSX DOM
 */
