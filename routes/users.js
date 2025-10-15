const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/contacts", ensureAuthenticated, userController.getAll);
router.get("/contact/:id", ensureAuthenticated, userController.getSingle);
router.post("/contacts", ensureAuthenticated, userController.createUser);
router.put("/contact/:id", ensureAuthenticated, userController.updateUser);
router.delete("/contact/:id", ensureAuthenticated, userController.deleteUser);

module.exports = router;