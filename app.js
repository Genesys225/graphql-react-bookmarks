const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const verifyJwt = require("./middleware/verifyJwt");
const manageHeaders = require("./middleware/manageHeaders");

const schema = require("./graphql/schema/index");
const resolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use(manageHeaders);

app.use(verifyJwt);

const server = new ApolloServer({ typeDefs: schema, resolvers, context: ({ req }) => req });

server.applyMiddleware({ app, path: "/graphql" });

mongoose
  .connect(process.env.MONGO_URI, {user:""genesys225",pass:"Mlab_pa555, useNewUrlParser: true})
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
