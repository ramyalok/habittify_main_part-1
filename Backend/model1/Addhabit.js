const mongoose = require("mongoose");
const HabitSchema = new mongoose.Schema(
  {
    habitName: {
      type: String,
      required: true,
       
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

// ✅ Add the index AFTER the schema
HabitSchema.index(//This means MongoDB checks both fields together: createdBy + habitName
  {
    createdBy: 1,
    habitName: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Habits",HabitSchema);
// Why did you use a Compound Index?because your project requirement was:A user should not create the same habit twice.Different users can create the same habit.
// Example:
// Ramya Drink Water   ✅
// Ramya Drink Water   ❌
// Kumar Drink Water   ✅
 

// A compound index is an index created on two or more fields. MongoDB checks the combination of those fields instead of a single field. In my Habitify project, I used a compound unique index on createdBy and habitName. This allows different users to create the same habit, but prevents the same user from creating duplicate habits. It also improves query performance when searching using both fields.

// If the interviewer asks, "Why not use unique: true on habitName?"

// You can answer:

// If I use unique: true on habitName, then no user in the entire application can create the same habit. For example, if one user creates "Drink Water", every other user would get a duplicate key error. That's not the requirement. Using a compound unique index on createdBy and habitName ensures uniqueness only for each individual user.
 
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