const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const resolvers = require("./resolvers");

module.exports = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req }) => {
    console.log(req.body);
    return req;
  }
});
