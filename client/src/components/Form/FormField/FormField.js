import { camelize } from "../../../utils/utilities";
import React, { useState } from "react";

export const FormField = props => {
  const [firstBlur, setfirstBlur] = useState(false);
  const [error, setError] = useState(false);
  const camelName = camelize(props.children.toString());

  const validate = target => {
    const error = props.setFieldState(camelName, target);
    setError(error);
  };

  const changeEventHandler = ({ target }) => {
    console.log(target.value);
    validate(target);
  };

  const blurEventHandler = ({ target }) => {
    setfirstBlur(true);
    validate(target);
  };

  // const focusEventHandler = () => setfirstBlur(false);

  const { children: title } = props;

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
    type: props.type ? props.type : deduceType(title)
  };
  if (fieldAttributes.type === "number" || "range") {
    fieldAttributes.min = props.min ? props.min : 0;
    fieldAttributes.max = props.max ? props.max : null;
  }

  return (
    <div className="form-group mb-3">
      <label htmlFor={camelName}>{props.children} </label>
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
};

const deduceType = title => {
  const lowerCaseTitle = title.toLowerCase();
  if (lowerCaseTitle.includes("email")) return "email";
  else if (lowerCaseTitle.includes("pass")) return "password";
  else if (lowerCaseTitle.includes("date")) return "date";
  else if (lowerCaseTitle.includes("price")) return "number";
  else if (lowerCaseTitle.includes("phone")) return "tel";
  else if (lowerCaseTitle.includes("tel")) return "tel";
  else return "text";
};
