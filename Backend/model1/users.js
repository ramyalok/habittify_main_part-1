const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },

    // Profile Information
    age: {
      type: Number,
      default: null,
    },

    height: {
      type: Number,
      default: null,
    },

    weight: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      default: "",
    },

    // dailyActivity: {
    //   type: String,
    //   default: "",
    // },

    reminderTime: {
      type: String,
      default: "",
    },

    dailyactivitylevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    goal: {
      type: String,
      enum: [
        "weight_loss",
        "weight_gain",
        "fitness",
        "study",
        "productivity",
        "mental_health",
      ],
      default: "fitness",
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpire: {
      type: Date,
      default: null,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("HabitifyUsers", UserSchema);
