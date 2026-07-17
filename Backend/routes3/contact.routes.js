const router = require("express").Router();

const auth = require("../middleware4/auth.middleware");
const role = require("../middleware4/role.middleware");

const controller = require("../controller2/contact.controller");

// User
router.post("/create", auth, controller.createSuggestion);

// Admin
router.get("/all", auth, role("admin"), controller.getAllSuggestions);

router.delete("/delete/:id", auth, role("admin"), controller.deleteSuggestion);

module.exports = router;
