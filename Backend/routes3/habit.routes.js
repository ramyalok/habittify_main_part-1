const express = require("express");
const router = express.Router();

const habitcontroller = require("../controller2/habitCrud.controller");
//mw
const auth = require("../middleware4/auth.middleware");
const role = require ("../middleware4/role.middleware");

router.post("/create",auth,role,habitcontroller.addHabit);

router.get("/get",auth,habitcontroller.getHabit);

router.put("/update/:id",auth,habitcontroller.updateHabit);

router.delete("/delete/:id",auth,habitcontroller.deleteHabit);

router.patch("/:id/toggle", auth, habitcontroller.toggleHabit);

router.get("/suggestions", auth, habitcontroller.generateHabits);

router.put("/profile", auth, habitcontroller.updateProfile);


module.exports = router;