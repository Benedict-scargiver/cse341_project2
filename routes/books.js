const express = require("express");
const router = express.Router();
const bookController = require("../controllers/books");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/books", ensureAuthenticated, bookController.getAll);
router.get("/book/:id", ensureAuthenticated, bookController.getSingle);
router.post("/books", ensureAuthenticated, bookController.createBook);
router.put("/book/:id", ensureAuthenticated, bookController.updateBook);
router.delete("/book/:id", ensureAuthenticated, bookController.deleteBook);

module.exports = router;
