const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();


app.set("view engine", "ejs");

const mongodb = require("./database");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("index.ejs", {
    pageTitle: "Benedict's Home",
    url: process.env.APP_URL,
  });
});

app
  .use(bodyParser.json())
  .use(cors())
  .use("/", require("./routes"))
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
    console.log(`Web Service running on PORT: ${PORT}, alongside a database`);
  }
});
