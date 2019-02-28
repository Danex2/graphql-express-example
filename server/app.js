const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("../server/schema/schema");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${
      process.env.DB_PASSWORD
    }@cluster0-shard-00-00-oesbn.mongodb.net:27017,cluster0-shard-00-01-oesbn.mongodb.net:27017,cluster0-shard-00-02-oesbn.mongodb.net:27017/books?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(connect => {
    console.log("Connected to database.");
    app.listen(4000, () => console.log("Listening on port 4000!"));
  });
