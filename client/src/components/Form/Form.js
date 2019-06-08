import React, { useState, useRef } from "react";
import { toInitialStateObj, camelize } from "../../utils/utilities";
import "./Form.css";
import formValidation from "./formValidation";

const Form = props => {
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState(true);
  let { children: childrenFields } = props;
  // this checks if only one field is passed and wraps it in an array if it is
  if (!Array.isArray(childrenFields)) childrenFields = [childrenFields];
  /**  this initializes the form fields state object using a function:
   * @function {toInitialStateObj()} receives
   * @param {FormField[]} and
   * @returns {Object} with the fields text as keys and values of null
   */
  const [inputValues, setInputValues] = useState(
    toInitialStateObj(childrenFields.map(childField => camelize(childField.props.children)))
  );
  /** setting the field state function, it is passed to the fields components to be used there
   * @param {input.name, input}
   * @returns {{error} or "nothing"}
   */
  const setFieldState = (fieldName, fieldTarget) => {
    const prevState = inputValues;
    // this is the validation step, it returns an error object or false
    const error = formValidation(fieldTarget);
    if (error) {
      // this is to allow fake submission, in order to trigger HTML5 validation message
      setInputValues({ ...prevState, [fieldName]: null });
      return error;
    }
    if (Object.values(inputValues).indexOf(null) > -1) setFormErrors(true);
    else setFormErrors(false);

    console.log(fieldTarget);
    // sets email input to lowercase (for convention)
    if (fieldName === "email")
      setInputValues({
        ...prevState,
        [fieldName]: fieldTarget.value.toLowerCase()
      });
    // sets file inputs
    else if (fieldTarget.type === "file") {
      const { Files } = fieldTarget;
      setInputValues({
        ...prevState,
        [fieldName]: Files
      });
    }
    // this is the actual state set
    else setInputValues({ ...prevState, [fieldName]: fieldTarget.value });
    console.log(inputValues, formErrors);
  };

  const onConfirm = (e, setProgress) => {
    if (!formErrors) {
      e.preventDefault();
      props.submitForm(inputValues, setProgress);
    }
  };

  const onAltAction = e => {
    e.preventDefault();
    /**  this is to allow form reset
     * @todo  provide api*/
    formRef.current.reset();
    props.altAction();
  };

  /** this map clones the form children (FormField)s and adds some key properties
   * @param {FormField[]}
   * @returns {FormField[]} - extended with form methods:
   * @method {setFieldState} and
   * @method {onConfirm} - Form control, fired when confirm button is pressed
   */
  const formfieldsArray = childrenFields.map((field, index) =>
    React.cloneElement(
      field,
      { ...field.props, setFieldState, key: index, onConfirm },
      field.props.children
    )
  );

  return (
    <form
      // this is to prevent POST action
      onSubmit={e => e.preventDefault()}
      className={props.className}
      id="defaultForm"
      ref={formRef}
    >
      {formfieldsArray}
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
/** @type {React.component} */
export default Form;
/** @type {React.component} - to be used with this Form framework child  */
export { FormField } from "./FormField/FormField";
