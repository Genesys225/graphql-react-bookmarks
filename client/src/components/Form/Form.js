import React, { useState } from "react";
import { toInitialStateObj, camelize } from "../../utils/utilities";
import { FormField } from "./FormField/FormField";

import "./Form.css";
import formValidation from "./formValidation";

const Form = props => {
  const [formErrors, setFormErrors] = useState(true);
  let { children: childrenFields } = props;
  if (!Array.isArray(childrenFields)) childrenFields = [childrenFields];
  const [inputValues, setInputValues] = useState(
    toInitialStateObj(childrenFields.map(childField => camelize(childField.props.children)))
  );

  const setFieldState = (fieldName, fieldTarget) => {
    const prevState = inputValues;
    const error = formValidation(fieldTarget);
    if (error) {
      setInputValues({ ...prevState, [fieldName]: null });
      return error;
    }
    if (Object.values(inputValues).indexOf(null) > -1) {
      setFormErrors(true);
      console.log(inputValues);
    } else {
      setFormErrors(false);
    }
    setInputValues({ ...prevState, [fieldName]: fieldTarget.value });
  };

  const childrenProps = childrenFields.map(childField => childField.props);

  const RenderForm = childrenProps.map(child => {
    const { children: title } = child;
    const minLength = () => child.minLength && child.minLength;
    const min = () => child.min && child.min;
    const type = () => child.type && child.type;

    return (
      <FormField
        setFieldRefState={setFieldState}
        key={title}
        minLength={minLength()}
        min={min()}
        type={type()}
      >
        {title}
      </FormField>
    );
  });

  const onConfirm = e => {
    if (!formErrors) {
      e.preventDefault();
      props.submitForm(inputValues);
    } else return;
  };

  const onAltAction = e => {
    e.preventDefault();
    props.altAction();
  };

  return (
    <form className="auth-form" onSubmit={e => e.preventDefault()}>
      {RenderForm}
      <div className="form-actions">
        <button type="submit" onClick={e => onConfirm(e)}>
          {props.confirmBtnText}
        </button>
        <button type="button" onClick={e => onAltAction(e)}>
          {props.altBtnText}
        </button>
      </div>
    </form>
  );
};

export default Form;
