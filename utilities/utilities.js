module.exports = function jwtDecode(t) {
  let token = {};
  token.raw = t;
  token.header = JSON.parse(Buffer.from(t.split(".")[0], "base64").toString("ascii"));
  token.payload = JSON.parse(Buffer.from(t.split(".")[1], "base64").toString("ascii"));
  return token;
};
