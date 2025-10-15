const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const { passport } = require("./middleware/auth");
const app = express();

app.set("view engine", "ejs");

const mongodb = require("./database");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");
const PORT = process.env.PORT || 3000;

// Session and passport setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(cors());

// GitHub OAuth routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // Redirect or respond after successful login
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Test route to check authentication
const { ensureAuthenticated } = require("./middleware/auth");
app.get("/auth/test", ensureAuthenticated, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// API and docs
app.use("/", require("./routes"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});