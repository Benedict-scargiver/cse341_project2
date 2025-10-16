const express = require('express')
const router = require('express').Router()

router.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "CSE 341 Web Services",
    url: process.env.APP_URL
  });
});


router.use("/", require('./users'));
router.use("/", require('./profession'));
router.use("/", require('./books'));
router.use("/", require('./author'));

module.exports = router

