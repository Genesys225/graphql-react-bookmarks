export function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}
export function toInitialStateObj(arr) {
  var returnObject = {};
  for (var i = 0; i < arr.length; ++i) returnObject[arr[i]] = null;
  return returnObject;
}
