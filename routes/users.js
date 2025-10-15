const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");

router.get("/contacts", userController.getAll);
router.get("/contact/:id", userController.getSingle);
router.post("/contacts", userController.createUser);
router.put("/contact/:id", userController.updateUser);
router.delete("/contact/:id", userController.deleteUser);

module.exports = router;
