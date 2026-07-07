const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HabitifyUsers",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Reviews", ReviewSchema);
// Why this model?

// We're not storing:

// ❌ username
// ❌ email
// ❌ profileImage

// because they're already in your HabitifyUsers collection.

// Instead we store only:

// Review
// │
// ├── user (ObjectId)
// ├── rating
// ├── message
// ├── isApproved
// ├── createdAt
// └── updatedAt

// Later, we'll use:

// .populate("user", "username email profileImage")

// and MongoDB will automatically fetch the user's details.

// Example document in MongoDB
// {
//   "_id": "...",
//   "user": "687f4c5d9d....",
//   "rating": 5,
//   "message": "Habitify really helped me stay consistent.",
//   "isApproved": false,
//   "createdAt": "...",
//   "updatedAt": "..."
// }

// When populated:

// {
//   "user": {
//     "username": "Ramya",
//     "email": "ram@gmail.com",
//     "profileImage": "/uploads/profile/abc.jpg"
//   },
//   "rating": 5,
//   "message": "Habitify really helped me stay consistent."
// }