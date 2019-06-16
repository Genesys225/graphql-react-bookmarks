/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useContext, useEffect } from "react";
import { State, Dispatch, formActions } from "./Store";
import "./Form.css";
const { types } = formActions;
/** @type { formState: React.component }
 * it requires FormStore to be a (DOM) parent to provide the Store  */
const Form = props => {
  const formRef = useRef(null);
  const { formState } = useContext(State);
  const dispatch = useContext(Dispatch);

  useEffect(() => dispatch({ type: types.reset, props }), []);

  let { children: childrenFields } = props;
  if (!Array.isArray(props.children)) childrenFields = [props.children];

  const inputsState = () => {
    let derivedState = {};
    for (const inputState in Form) {
      derivedState = {
        ...derivedState,
        [inputState]: {
          value: formState[inputState].value,
          error: formState[inputState].error
        }
      };
    }
    return derivedState;
  };
  const onConfirm = (e, setProgress) => {
    if (!error) {
      e.preventDefault();
      props.submitForm(inputsState(), setProgress);
    }
  };

  const { error } = Form;

  const onAltAction = e => {
    e.preventDefault();
    /**  this is to allow form reset
     * @todo  provide api*/
    formRef.current.reset();
    props.altAction();
  };

  /** this map clones the form children (FormField)s and adds some key properties
   * @param [FormField]
   * @returns [FormField] where each field is extended with:
   * @method {onConfirm} - Form control, fired when confirm button is pressed
   */
  const formfieldsArray = childrenFields.map((field, index) =>
    React.cloneElement(field, { ...field.props, key: index, onConfirm }, field.props.children)
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

export default Form;
