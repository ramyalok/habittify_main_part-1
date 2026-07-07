const express = require("express");
const router = express.Router();

const reviewController = require("../controller2/review.controller");

const auth = require("../middleware4/auth.middleware");
const role = require("../middleware4/role.middleware");

// ================= USER REVIEW ROUTES =================

// Create Review
router.post("/create", auth, reviewController.createReview);
// Get Logged-in User Review
router.get("/myreview", auth, reviewController.getMyReview);
// Update Review
router.put("/update", auth, reviewController.updateReview);
// Delete Review
router.delete("/delete", auth, reviewController.deleteReview);

// ================= ADMIN REVIEW ROUTES =================
// Get All Reviews
router.get("/allreviews", auth, role("admin"), reviewController.getAllReviews);
// Approve Review by admin
router.put("/approve/:id", auth, role("admin"), reviewController.approveReview);
//delete any review
router.delete("/deleteReview/:id",auth,role("admin"),reviewController.deleteReviewByAdmin);
//getting the approved review for public user
router.get("/approved", reviewController.getApprovedReviews);
module.exports = router;
