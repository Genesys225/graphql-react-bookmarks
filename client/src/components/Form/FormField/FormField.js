import { camelize } from "../../../utils/utilities";
import React, { useState } from "react";

import "./FormField.css";

export const FormField = props => {
  const [firstBlur, setfirstBlur] = useState(false);
  const [error, setError] = useState(false);
  const camelName = camelize(props.children.toString());

  const validate = target => {
    const error = props.setFieldRefState(camelName, target);
    console.log(error);
    setError(error);
  };

  const changeEventHandler = target => validate(target);
  const blurEventHandler = target => {
    setfirstBlur(true);
    console.log(!!error && firstBlur);
    validate(target);
  };

  return (
    <div className="form-control">
      <label htmlFor={camelName}>
        {props.children}{" "}
        <div className={error && firstBlur ? "validationError" : "validationPassed"}>{error}</div>
      </label>
      <input
        type={camelName}
        id={camelName}
        onBlur={({ target }) => blurEventHandler(target)}
        onChange={({ target }) => changeEventHandler(target)}
        required
        minLength={props.minLength ? props.minLength : ""}
        min={props.min ? props.min : ""}
      />
    </div>
  );
};
