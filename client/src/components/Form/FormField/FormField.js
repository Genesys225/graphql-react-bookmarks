import { camelize } from "../../../utils/utilities";
import React, { useState } from "react";
import FileInput from "./FileInput";

export const FormField = props => {
  const [firstBlur, setfirstBlur] = useState(false);
  const [error, setError] = useState(false);
  const camelName = camelize(props.children.toString());

  const validate = (target, files) => {
    let error;
    target.type === "file"
      ? (error = props.setFieldState(camelName, target, files))
      : // this only reurns errors if they are present else leaves error undefined
        (error = props.setFieldState(camelName, target));
    setError(error);
  };

  const changeEventHandler = ({ target }, files) => {
    if (target.type === "file") validate(target, files);
    else validate(target);
  };

  const blurEventHandler = ({ target }, files) => {
    setfirstBlur(true);
    console.log(files, target, "BLUR");
    if (target.type === "file") validate(target, files);
    else validate(target);
  };

  // const focusEventHandler = () => setfirstBlur(false);

  const { children: title, type } = props;

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
  if (fieldAttributes.type === "number" || "range") {
    fieldAttributes.min = props.min ? props.min : 0;
    fieldAttributes.max = props.max ? props.max : null;
  }

  switch (fieldAttributes.type) {
    case "file":
      fieldAttributes.className = `${fieldAttributes.className} mb-1`;
      return (
        <FileInput
          fieldAttributes={fieldAttributes}
          parentProps={{
            title,
            error,
            camelName,
            onConfirm: props.onConfirm
          }}
        />
      );

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

const deduceType = title => {
  const lowerCaseTitle = title.toLowerCase();
  if (lowerCaseTitle.includes("email")) return "email";
  else if (lowerCaseTitle.includes("pass")) return "password";
  else if (lowerCaseTitle.includes("date")) return "date";
  else if (lowerCaseTitle.includes("price")) return "number";
  else if (lowerCaseTitle.includes("phone")) return "tel";
  else if (lowerCaseTitle.includes("tel")) return "tel";
  else if (lowerCaseTitle.includes("file")) return "file";
  else return "text";
};
