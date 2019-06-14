import { formActions } from "./Store/actionTypes";
import formValidation from "./formValidation";
import { camelize } from "../../utils/utilities";

const { types } = formActions;

const formReducer = (state, action) => {
  switch (action.type) {
    case types.setFields:
      const { fieldName, fieldTarget } = action;
      const { fieldAttributes } = state[fieldName];
      const { className } = state[fieldName].fieldAttributes;
      const error = formValidation(fieldTarget);
      let value = fieldTarget.value;
      // this is to allow fake submission, in order to trigger HTML5 validation message
      if (error) value = null;
      // sets email input to lowercase (for convention)
      else if (fieldName === "email") value = fieldTarget.value.toLowerCase();
      // sets file inputs
      else if (fieldTarget.type === "file") value = fieldTarget.Files;
      // this is the actual state set
      return {
        ...state,
        [fieldName]: {
          fieldAttributes: {
            ...fieldAttributes,
            className: error
              ? className.indexOf("invalid") === -1
                ? className.concat(" is-invalid")
                : className
              : className.split(" is-invalid")[0]
          },
          error: error ? error : false,
          value
        },
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
  console.log("init runing");
  const rootProps = {
    error: false,
    firstBlur: false
  };
  const tempFields = !Array.isArray(props.children) ? [props.children] : props.children;
  const childrenFields = tempFields.map(field => {
    return { title: field.props.children, props: field.props };
  });
  const initialState = childrenFields.reduce((result, field) => {
    const camelName = camelize(field.title);
    return Object.assign({}, result, {
      [camelName]: {
        fieldAttributes: fieldAttributes(camelName, field.props, field.title),
        value: null,
        error: false
      }
    });
  }, rootProps);
  return initialState;
};
export const formInitialState = {};
/**
 * these are the attributes of the input field
 * @type {React.props} - In tag text passed by the FormField the JSX DOM
 */
const fieldAttributes = (camelName, props, childFieldText) => {
  const type = props.type ? props.type : deduceType(childFieldText);
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
