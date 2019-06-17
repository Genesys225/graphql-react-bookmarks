/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { State, Dispatch, formActions } from "./Store";
import "./Form.css";
const { types } = formActions;
/** @type { FormFrameWork: React.component }
 * it requires FormStore to be a (DOM) parent to provide the Store  */
const Form = props => {
  const { formState } = useContext(State);
  const { inputFields } = formState;
  const dispatch = useContext(Dispatch);

  useEffect(() => dispatch({ type: types.reset, props }), []);

  let { children: childrenFields } = props;
  if (!Array.isArray(props.children)) childrenFields = [props.children];

  const { error } = formState;

  const onConfirm = (e, setProgress) => {
    if (!error) {
      e.preventDefault();
      props.submitForm(inputsState(inputFields), setProgress);
    }
  };

  const onAltAction = e => {
    e.preventDefault();
    dispatch({ type: types.reset, props });
    props.altAction();
  };

  /** this map clones the form children (FormField)s and adds some key properties
   * @param [FormField]
   * @returns [FormField] where each field is extended with:
   * @method {onConfirm} - Form control, fired when confirm button is pressed
   */
  const formfieldsArray = childrenFields.map((field, index) =>
    React.cloneElement(
      field,
      { ...field.props, key: index, index, onConfirm },
      field.props.children
    )
  );

  return (
    <form
      // this is to prevent POST action
      onSubmit={e => e.preventDefault()}
      className={props.className}
      id="defaultForm"
    >
      {inputFields && formfieldsArray}
      {/* if both butttons are disbled dont render the form actions container */}
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

const inputsState = inputFields =>
  inputFields.reduce((result, inputState, index) => {
    const { name } = inputState.fieldAttributes;
    return {
      ...result,
      [name]: {
        value: inputFields[index].value,
        error: inputFields[index].error
      }
    };
  }, {});
