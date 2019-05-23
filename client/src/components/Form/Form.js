import React, { useState, useRef } from "react";
import { toInitialStateObj, camelize } from "../../utils/utilities";
import "./Form.css";
import formValidation from "./formValidation";

const Form = props => {
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState(true);
  // this checks if only one field is passed and wraps it in an array if it is
  let { children: childrenFields } = props;
  if (!Array.isArray(childrenFields)) childrenFields = [childrenFields];
  // this is an ntitialized state object with all the child fields nullefied
  const [inputValues, setInputValues] = useState(
    toInitialStateObj(childrenFields.map(childField => camelize(childField.props.children)))
  );
  // setting the field state function, it is passed to the fields components to be used there
  const setFieldState = (fieldName, fieldTarget) => {
    const prevState = inputValues;
    // this is the validation step, it returns an error object or false
    const error = formValidation(fieldTarget);
    if (error) {
      // this is to allow fake submittion, in order to triger HTML5 validation message
      setInputValues({ ...prevState, [fieldName]: null });
      return error;
    }
    if (Object.values(inputValues).indexOf(null) > -1) setFormErrors(true);
    else setFormErrors(false);

    // sets email input to lower case (for convention)
    if (fieldName === "email")
      setInputValues({
        ...prevState,
        [fieldName]: fieldTarget.value.toLowerCase()
      });
    // sets file inputs
    else if (fieldTarget.type === "file") {
      let files = fieldTarget.files;
      if (fieldTarget.files.length === 1) files = fieldTarget.files[0];
      console.log(files);
      setInputValues({
        ...prevState,
        [fieldName]: files
      });
    }
    // this is the actual state set
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
    // this is to allow form reset NEEDTODO: "provide api"
    formRef.current.reset();
    props.altAction();
  };

  return (
    <form
      // this is to prevent POST action
      onSubmit={e => e.preventDefault()}
      className={props.className}
      id="defaultForm"
      ref={formRef}
    >
      {childrenFields.map((field, index) =>
        React.cloneElement(
          field,
          { ...field.props, setFieldState, key: index, onConfirm },
          field.props.children
        )
      )}
      {(props.canConfirm || props.canAltAction) && (
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
      )}
    </form>
  );
};

export default Form;

export { FormField } from "./FormField/FormField";
