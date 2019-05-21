const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const verifyJwt = require("./middleware/verifyJwt");
const manageHeaders = require("./middleware/manageHeaders");
const server = require("./graphql/server");

const app = express();

app.use(bodyParser.json());

app.use(manageHeaders);

app.use(verifyJwt);

app.use(express.static(__dirname + "/client/build"));
app.use(express.static(__dirname + "/client/public"));

app.use("/restapi/uploads", require("./routes/restapi/uploads"));

server.applyMiddleware({ app, path: "/graphql" });

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("mongo's up");
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
