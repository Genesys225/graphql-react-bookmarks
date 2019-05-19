import React, { useState, useRef } from "react";
import { toInitialStateObj, camelize } from "../../utils/utilities";
import "./Form.css";
import formValidation from "./formValidation";

const Form = props => {
  const formRef = useRef(null);
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
    if (fieldName === "email")
      setInputValues({
        ...prevState,
        [fieldName]: fieldTarget.value.toLowerCase()
      });
    else setInputValues({ ...prevState, [fieldName]: fieldTarget.value });
  };

  const onConfirm = e => {
    if (!formErrors) {
      e.preventDefault();
      props.submitForm(inputValues);
    } else return;
  };

  const onAltAction = e => {
    e.preventDefault();
    formRef.current.reset();
    props.altAction();
  };

  return (
    <form
      onSubmit={e => e.preventDefault()}
      className={props.className}
      id="defaultForm"
      ref={formRef}
    >
      {childrenFields.map((field, index) =>
        React.cloneElement(
          field,
          { ...field.props, setFieldState, key: index },
          field.props.children
        )
      )}
      <div className="form-actions mt-5">
        {props.canConfirm && (
          <button type="submit" onClick={onConfirm} className="btn">
            {props.confirmBtnText}
          </button>
        )}
        {props.canAltAction && (
          <button type="button" onClick={onAltAction} className="btn">
            {props.altBtnText}
          </button>
        )}
      </div>
    </form>
  );
};

export default Form;

export { FormField } from "./FormField/FormField";
