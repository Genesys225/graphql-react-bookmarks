export default function formValidation(inputsArr) {
  let errors;
  const validateSingle = input => {
    let error = { id: input.id };
    if (!input.validity.valid)
      switch (input.id) {
        case "eventTitleInput":
          error.value = "Title shuld be at least two letters";
          return error;
        default:
          switch (input.type) {
            case "email":
              error.value = "Email should be ";
              break;

            default:
              break;
          }
          error.value = "Input error";
          return error;
      }
    else {
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
