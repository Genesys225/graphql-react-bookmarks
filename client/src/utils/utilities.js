export function camelize(text) {
  return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
}
export function toInitialStateObj(arr) {
  var returnObject = {};
  for (var i = 0; i < arr.length; ++i) returnObject[arr[i]] = null;
  return returnObject;
}

export const filterObject = (fieldAttributes, ...rest) =>
  Object.keys(fieldAttributes)
    .filter(key => ![...rest].includes(key))
    .reduce((obj, key) => {
      obj[key] = fieldAttributes[key];
      return obj;
    }, {});
