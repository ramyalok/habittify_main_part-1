const express = require("express");
const router = express.Router();

const habitcontroller = require("../controller2/habitCrud.controller");
//mw
const auth = require("../middleware4/auth.middleware");
const role = require("../middleware4/role.middleware");

router.post("/create", auth, habitcontroller.addHabit);

router.get("/get", auth, habitcontroller.getHabit);

router.put("/update/:id", auth, habitcontroller.updateHabit);

router.delete("/delete/:id", auth, habitcontroller.deleteHabit);

router.patch("/:id/toggle", auth, habitcontroller.toggleHabit);

router.get("/suggestions", auth, habitcontroller.generateHabits);

router.get("/getprofile", auth, habitcontroller.getProfile);
router.put( "/profileimage",auth,upload.single("image"),habitcontroller.uploadProfileImage);
router.put("/updateprofile", auth, habitcontroller.updateProfile);
router.delete("/deleteprofile", auth, habitcontroller.deleteProfile);

module.exports = router;
