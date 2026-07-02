const express = require("express");
const router = express.Router();
const adminController = require("../controller2/admin.controller");

const auth = require("../middleware4/auth.middleware");
const role = require("../middleware4/role.middleware");

router.get("/allusers", auth, role("admin"), adminController.getAllUsers);
router.get("/allhabits", auth, role("admin"), adminController.getAllHabits);
router.delete("/deleteusers/:id", auth, role("admin"), adminController.deleteUser);
router.put("/updaterole/:id/role", auth, role("admin"), adminController.changeRole);

router.get("/dashboard", auth, role("admin"), adminController.getDashboard);
 
module.exports = router;
// Login
//    │
//    ▼
// JWT Token
//    │
//    ▼
// verifyToken
//    │
//    ▼
// req.user = {
//     id,
//     role
// }
//    │
//    ├──────────────► User Route
//    │                  createdBy = req.user.id
//    │
//    ▼
// isAdmin Middleware
//    │
//    ▼
// Admin Routes
//    │
//    ▼
// See All Users
// See All Habits
// Delete Any User