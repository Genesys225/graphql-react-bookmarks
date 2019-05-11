import React, { useState } from "react";
import { toInitialStateObj, camelize } from "../../utils/utilities";
import { FormField as Field } from "./FormField/FormField";

// import "./Form.css";
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

  const RenderForm = childrenProps.map(child => {
    const { children: title } = child;
    const minLength = () => child.minLength && child.minLength;
    const min = () => child.min && child.min;
    const type = () => (child.type ? child.type : deduceType(title));

    return (
      <Field
        setFieldRefState={setFieldState}
        key={title}
        minLength={minLength()}
        min={min()}
        type={type()}
      >
        {title}
      </Field>
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
        {props.canConfirm && (
          <button type="submit" onClick={e => onConfirm(e)}>
            {props.confirmBtnText}
          </button>
        )}
        {props.canAltAction && (
          <button type="button" onClick={e => onAltAction(e)}>
            {props.altBtnText}
          </button>
        )}
      </div>
    </form>
  );
};

export default Form;

export const FormField = () => null;
