const express = require("express");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const graphQlSchema = require("./graphql/typeDefs");
const graphQlResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/is-auth");
const app = express();
app.use(bodyParser.json());

// Custom CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

// Connect Graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.use("/", (req, res) =>
  res.send(
    "Welcome to User blog GraphQL API, use /playground or /graphql for playground"
  )
);

// Initialize  app
const startApp = async () => {
  try {
    // Database Connection
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@user-profile-9xaur.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log(`*** Connected to database ***`);
    const PORT = process.env.PORT || 5000;
    app.listen({ port: PORT }, () =>
      console.log(`*** Server running on: http://localhost:${PORT} ***`)
    );
  } catch (err) {
    console.log(err.message);
  }
};

startApp();
