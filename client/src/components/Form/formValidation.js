export default function formValidation(inputsArr) {
  let errors;
  const validateSingle = input => {
    let error = { id: input.id };
    if (Array.isArray(input.Files)) {
      if (input.Files.length > 0) {
        error.value = false;
        return error;
      } else {
        error.value = input.validationMessage;
        return error;
      }
    } else if (!input.validity.valid && input.type !== "file") {
      switch (input.type) {
        case "email":
          error.value = emailValidationHandler(input);
          break;

        case "file":
          if (input.Files && input.Files.length > 0) error.value = false;
          else error.value = input.validationMessage;
          break;

        default:
          error.value = defaultValidationHandler(input);
          break;
      }
      return error;
    } else {
      error.value = false;
      return error;
    }
  };
  if (!Array.isArray(inputsArr)) return validateSingle(inputsArr).value;
  else errors = inputsArr.map(input => validateSingle(input));
  let returnObj = {};
  errors.map(error => (returnObj[error.id] = error.value));
  return returnObj;
}

function validateEmail(email) {
  // eslint-disable-next-line
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function emailValidationHandler(input) {
  const customValidationRes = validateEmail(input.value);
  if (input.validity.valueMissing)
    input.setCustomValidity(`Please fill out the ${input.name} field.`);
  else if (input.validity.typeMismatch) input.setCustomValidity(``);
  else if (!customValidationRes)
    // this is overulled by the typeMismatch check
    input.setCustomValidity(`Email should be of pattern someone@somewhere.something.`);
  else input.setCustomValidity("");

  return input.validationMessage;
}

function defaultValidationHandler(input) {
  if (input.validity.valueMissing) {
    input.setCustomValidity(`Please fill out the ${input.name} field.`);
    const res = input.validationMessage;
    input.setCustomValidity(``);
    return res;
  } else return input.validationMessage;
}
