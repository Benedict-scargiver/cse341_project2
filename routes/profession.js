const express = require("express");
const router = express.Router();
const professionController = require("../controllers/professions");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/professions", ensureAuthenticated, professionController.getAll);
router.get("/profession/:id", ensureAuthenticated, professionController.getSingle);
router.post("/professions", ensureAuthenticated, professionController.createProfession);
router.put("/profession/:id", ensureAuthenticated, professionController.updateProfession);
router.delete("/profession/:id", ensureAuthenticated, professionController.deleteProfession);

module.exports = router;
