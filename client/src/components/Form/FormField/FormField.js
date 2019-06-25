import { camelize } from "../../../utils/utilities";
import React, { useContext } from "react";
import FileInput from "./FileInput/FileInput";
import { State } from "../Store";
import useWhyDidYouUpdate from "../../../customHooks/whyDidUrender";

/** @type {React.component}
 * @description to be used with Form framework  */
export const FormField = props => {
  const { children, onBlur, onChange } = props;
  const fieldName = camelize(children);
  const { formState } = useContext(State);
  useWhyDidYouUpdate("Counter", props);
  const { inputFields } = formState;
  const state = inputFields[props.index];
  const { error, fieldAttributes } = state;

  if (!fieldAttributes) return null;
  const { title } = fieldAttributes;
  console.log(fieldAttributes);
  const filteredAttributes = { ...fieldAttributes, onBlur, onChange }; // filterObject(fieldAttributes, "title");
  delete filteredAttributes.title;
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
