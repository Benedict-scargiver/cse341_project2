const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authors");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/authors", ensureAuthenticated, authorController.getAll);
router.get("/author/:id", ensureAuthenticated, authorController.getSingle);
router.post("/authors", ensureAuthenticated, authorController.createAuthor);
router.put("/author/:id", ensureAuthenticated, authorController.updateAuthor);
router.delete("/author/:id", ensureAuthenticated, authorController.deleteAuthor);

module.exports = router;
