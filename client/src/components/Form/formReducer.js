import { formActions } from "./Store/actionTypes";
import formValidation from "./formValidation";
import { camelize } from "../../utils/utilities";

const { types } = formActions;
let fieldsEnum = {};

const formReducer = (state, action) => {
  switch (action.type) {
    case types.setField:
      const { fieldName, fieldTarget } = action;
      const fieldIndex = fieldsEnum[fieldName];
      const { fieldAttributes } = state.inputFields[fieldIndex];
      const { className } = fieldAttributes;
      const error = formValidation(fieldTarget);
      let value = fieldTarget.value;
      // this is to allow fake submission, in order to trigger HTML5 validation message
      if (error) value = null;
      // sets email input to lowercase (for convention)
      else if (fieldName === "email") value = fieldTarget.value.toLowerCase();
      // sets file inputs
      else if (fieldTarget.type === "file") value = fieldTarget.Files;
      // this is the actual state set
      const updatedFields = state.inputFields;
      updatedFields[fieldIndex] = {
        fieldAttributes: {
          ...fieldAttributes,
          className:
            error && state.firstBlur
              ? className.indexOf("invalid") === -1
                ? className.concat(" is-invalid")
                : className
              : className.split(" is-invalid")[0]
        },
        error: error && state.firstBlur ? error : false,
        value
      };
      return {
        ...state,
        inputFields: updatedFields,
        error: !!error
      };

    case types.setFirstBlur:
      return { ...state, firstBlur: action.payload };

    case types.reset:
      return init(action.props);

    default:
      return state;
  }
};

export default formReducer;

const init = props => {
  // checking if only one field is passed and wraps it in an array if it is true
  const tempFields = !Array.isArray(props.children) ? [props.children] : props.children;
  const childrenFields = tempFields.map(field => ({
    title: field.props.children,
    props: field.props
  }));

  fieldsEnum = childrenFields.reduce(
    (result, { title }, index) => ({ ...result, [camelize(title)]: +index }),
    {}
  );

  const initialState = {
    inputFields: childrenFields.map(field =>
      // creates a field initial state object wit a nested attributes object
      ({
        fieldAttributes: fieldAttributes(camelize(field.title), field.props, field.title),
        value: null,
        error: false
      })
    ),
    error: false,
    firstBlur: false
  };

  return initialState;
};
export const formInitialState = {};
/**
 * these are the attributes of the input field
 * @type {React.props} - In tag text passed by the FormField the JSX DOM
 */
const fieldAttributes = (camelName, props, childFieldText) => {
  const type = props.type ? props.type : deduceType(childFieldText);
  //compares input.type equal to "number" or "range" and sets attributes and or defaults
  const returnObj =
    ["number", "range"].indexOf(type) > -1
      ? {
          min: props.min ? props.min : 0,
          max: props.max ? props.max : null
        }
      : {};
  if (props.minLength) returnObj.minLength = props.minLength;
  if (props.maxLength) returnObj.maxLength = props.maxLength;
  return {
    className: "form-control mb-1",
    id: camelName,
    name: camelName,
    required: true,
    title: childFieldText,
    type,
    ...returnObj
  };
};
/**
 * this is trying to deduce the input type from the passed tag body text
 * @param String In tag text passed by the FormField, in the parent Form JSX DOM
 */
const deduceType = title => {
  const lowerCaseTitle = title.toLowerCase();
  const hasString = string => lowerCaseTitle.includes(string); // returns cool false weather
  if (hasString("email")) return "email";
  else if (hasString("pass")) return "password";
  else if (hasString("date")) return "date";
  else if (hasString("price")) return "number";
  else if (hasString("phone")) return "tel";
  else if (hasString("tel")) return "tel";
  else if (hasString("file")) return "file";
  else return "text";
};
