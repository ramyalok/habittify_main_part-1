const mongoose = require("mongoose");
const HabitSchema = new mongoose.Schema(
  {
    habitName: {
      type: String,
      required: true,
      unique:true
    },
    emoji: {
      type: String,
      default: "✨",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    streak: {
      type: Number,
      required: true,
      default: 0,
    },
    history: {
      type: Object,
      required: true,
      default: {},
    },
    isSuggested: {
      type: Boolean,
      default: false,
    },
    lastCompletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HabitifyUsers",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Habits",HabitSchema);

 
// MongoDB automatically stores:

// {
// "habitName":"Exercise",

// "emoji":"🏋️",

// "completed":false,

// "streak":0,

// "history":{},

// "createdBy":"user123"
// }

// because schema has:

// default:false
// default:0
// default:{}

// So:

// Schema = all possible fields

// req.body = only values user enters

// defaults = values MongoDB fills automatically