import { camelize } from "../../../utils/utilities";
import React, { useState } from "react";
import FileInput from "./FileInput/FileInput";

export const FormField = props => {
  const [firstBlur, setFirstBlur] = useState(false);
  const [error, setError] = useState(false);
  const camelName = camelize(props.children.toString());

  const validate = target =>
    // this only returns errors if they are present else leaves error undefined
    setError(props.setFieldState(camelName, target));

  const changeEventHandler = ({ target }) => validate(target);

  const blurEventHandler = ({ target }) => {
    setFirstBlur(true);
    console.log(target.Files, "BLUR");
    validate(target);
  };

  // const focusEventHandler = () => setFirstBlur(false);

  const { children: title, type } = props;
  /**
   * these are the attributes of the input field
   * @type {React.props} - In tag text passed by the FormField the JSX DOM
   */
  const fieldAttributes = {
    className: `form-control${error && firstBlur ? " is-invalid" : ""}`,
    onBlur: blurEventHandler,
    onChange: changeEventHandler,
    // onFocus: focusEventHandler,
    id: camelName,
    name: camelName,
    required: true,
    minLength: props.minLength && props.minLength,
    maxLength: props.maxLength && props.maxLength,
    type: type ? type : deduceType(title)
  };
  //compares input.type equal to "number" or "range" and sets attributes and or defaults
  if (["number", "range"].indexOf(fieldAttributes.type) > -1) {
    fieldAttributes.min = props.min ? props.min : 0;
    fieldAttributes.max = props.max ? props.max : null;
  }
  /** additional parent props to be consumed by field children
   * @type {React.props}
   */
  const parentProps = {
    title,
    error,
    camelName,
    onConfirm: props.onConfirm
  };
  /** switch statement for special fields, defaults
   * to a turnery of regular input or text area
   * @return {React.component || HTML}
   */
  switch (fieldAttributes.type) {
    case "file":
      fieldAttributes.className = `${fieldAttributes.className} mb-1`;
      return <FileInput fieldAttributes={fieldAttributes} parentProps={parentProps} />;
    default:
      return (
        <div className="form-group mb-3">
          <label htmlFor={camelName}>{title}</label>
          {props.rows ? (
            <textarea {...fieldAttributes} rows={props.rows} />
          ) : (
            <input {...fieldAttributes} />
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
const deduceType = title => {
  const lowerCaseTitle = title.toLowerCase();
  const hasString = string => lowerCaseTitle.includes(string); // returns cool false weather
  if (hasString("email")) return "email";
  else if (hasString("pass")) return "password";
  else if (hasString("date")) return "date";
  else if (hasString("price")) return "number";
  else if (hasString("phone")) return "tel";
  else if (hasString("tel")) return "tel";
  else if (hasString("file")) return "file";
  else return "text";
};
