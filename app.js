const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const verifyJwt = require("./middleware/verifyJwt");
const manageHeaders = require("./middleware/manageHeaders");

const schema = require("./graphql/schema/index");
const resolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use(manageHeaders);

app.use(verifyJwt);

app.use(
  "/graphql",
  graphqlHttp({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
