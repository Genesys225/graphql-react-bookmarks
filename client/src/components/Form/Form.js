/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { State, Dispatch, formActions } from "./Store";
import "./Form.css";
const { types } = formActions;
let firstBlur = false;
/** @type { FormFrameWork: React.component }
 * it requires FormStore to be a (DOM) parent to provide the Store  */
const Form = props => {
  const { formState } = useContext(State);
  const { inputFields } = formState;
  const dispatch = useContext(Dispatch);

  useEffect(() => {
    dispatch({ type: types.reset, props });
  }, []);

  const childrenFields = Array.isArray(props.children) ? props.children : [props.children];

  const { error } = formState;
  const validate = fieldTarget =>
    dispatch({ type: types.setField, fieldName: fieldTarget.name, fieldTarget });

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

  const onChange = ({ target }) => validate(target);

  const onBlur = ({ target }) => {
    dispatch({ type: types.setFirstBlur, payload: firstBlur });
    validate(target);
    firstBlur = true;
  };

  /** this map clones the form children (FormField)s and adds some key properties
   * @param [FormField]
   * @returns [FormField] where each field is extended with:
   * @method {onConfirm} - Form control, fired when confirm button is pressed
   */
  const formfieldsArray = childrenFields.map((field, index) =>
    React.cloneElement(
      field,
      { ...field.props, key: index, index, onConfirm, onChange, onBlur },
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

/** produces an object of all the inputs values and error states, eatch input under it's name's key.
 * example {
 *            email: {
 *                      value: "example@email.com",
 *                      error: false
 *                   },
 *            password: {
 *                        value: "secret",
 *                        error: "password is too short"
 *                      }
 *         }
 */
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
