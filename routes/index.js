const router = require('express').Router()
const path = require("path");

router.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "..", "index.html");
  res.sendFile(indexPath);
});

router.use("/", require('./users'))

module.exports = router

