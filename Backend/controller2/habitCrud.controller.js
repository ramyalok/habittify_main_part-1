const HabitModel = require("../model1/Addhabit");
const HabitifyUsers = require("../model1/users");

exports.addHabit = async (req, res) => {
  try {
    const { habitName, emoji, isSuggested } = req.body;
    // check duplicate ONLY for current user or admin
    const IssameHabit = await HabitModel.findOne({
      habitName,
      createdBy: req.user.id,
    });
    if (IssameHabit) {
      return res.status(400).json({
        success: false,
        message: "Habit already Exists",
      });
    }
    const newHabit = await HabitModel.create({
      habitName,
      emoji,
      isSuggested,
      createdBy: req.user.id,
    });
    res.status(200).json({
      success: true,
      message: "Habits added successfully",
      data: newHabit,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
// So Habit needs ownership.User A → only Exercise //User B → only Reading
// Habit project should use 😎createdBy 😎if:Every user owns their own habits

exports.getHabit = async (req, res) => {
  try {
    const habits = await HabitModel.find({ createdBy: req.user.id });
    res
      .status(200)
      .json({ success: true, message: "All Habits ", data: habits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const updatedHabit = await HabitModel.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      req.body,
      { returnDocument: "after", runValidators: true },
    );
    //Update only//if logged user owns habit//User A can update only own habit
    //Only _id → findByIdAndUpdate()/ /Multiple conditions → findOneAndUpdate()
    if (!updatedHabit) {
      return res.status(404).json({ message: "Habit Not Found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Habit Updated successfully",
        data: updatedHabit,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    const deletedHabit = await HabitModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!deletedHabit) {
      return res.status(404).json({ message: "habit not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Habit deleted successfully",
        data: deletedHabit,
      });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleHabit = async (req, res) => {
  try {
    const habit = await HabitModel.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    const today = new Date().toLocaleDateString("en-CA");

    if (!habit.history) {
      habit.history = {};
    }

    // Toggle today's completion
    habit.history[today] = !habit.history[today];

    habit.markModified("history");

    habit.completed = habit.history[today];

    if (habit.completed) {
      habit.lastCompletedAt = new Date();
    } else {
      habit.lastCompletedAt = null;
    }
 
    // Calculate streak
    let streak = 0;
    let current = new Date();

    while (true) {
      const dateStr = current.toLocaleDateString("en-CA");

      if (habit.history[dateStr]) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    habit.streak = streak;

    await habit.save();

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.generateHabits = async (req, res) => {
  try {
    const user = await HabitifyUsers.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } // -----------------------------// Calculate BMI// -----------------------------
    let bmi = null;
    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      bmi = Number(
        (user.weight / (heightInMeters * heightInMeters)).toFixed(1),
      );
    }
    let bmiCategory = "Unknown";

    if (bmi !== null) {
      if (bmi < 18.5) {
        bmiCategory = "Underweight";
      } else if (bmi < 25) {
        bmiCategory = "Normal";
      } else if (bmi < 30) {
        bmiCategory = "Overweight";
      } else {
        bmiCategory = "Obese";
      }
    }
    let suggestions = []; // // GOAL : WEIGHT LOSS//
    if (user.goal === "weight_loss") {
      suggestions = [
        {
          habitName: "Drink Water",
          emoji: "💧",
          reason: "Stay hydrated",
        },
        {
          habitName: "Do Exercise And  30 Min Cardio",
          emoji: "🏃",
          reason: "Improve fitness",
        },
      ];
    }
    // GOAL : WEIGHT GAIN
    else if (user.goal === "weight_gain") {
      suggestions = [
        {
          habitName: "Protein Breakfast",
          emoji: "🍳",
          reason: "Build muscle",
        },
        {
          habitName: "Strength Training",
          emoji: "🏋️",
          reason: "Gain muscle",
        },
        {
          habitName: "Drink Milk",
          emoji: "🥛",
          reason: "Healthy calories",
        },
      ];
    } // GOAL : FITNESS
    else if (user.goal === "fitness") {
      suggestions = [
        {
          habitName: "Morning Workout",
          emoji: "🏃",
          reason: "Stay active",
        },
        {
          habitName: "Stretching",
          emoji: "🤸",
          reason: "Improve flexibility",
        },
        {
          habitName: "Drink Water",
          emoji: "💧",
          reason: "Support recovery",
        },
        {
          habitName: "Sleep 8 Hours",
          emoji: "😴",
          reason: "Better recovery",
        },
      ];
    } // GOAL : STUDY
    else if (user.goal === "study") {
      suggestions = [
        {
          habitName: "Read 20 Pages",
          emoji: "📚",
          reason: "Increase knowledge",
        },
        {
          habitName: "Practice Coding",
          emoji: "💻",
          reason: "Improve skills",
        },
        {
          habitName: "Plan Tomorrow",
          emoji: "📝",
          reason: "Stay organized",
        },
      ];
    } // GOAL : PRODUCTIVITY
    else if (user.goal === "productivity") {
      suggestions = [
        {
          habitName: "Plan Daily Tasks",
          emoji: "📝",
          reason: "Increase productivity",
        },
        {
          habitName: "No Social Media for 2 Hours",
          emoji: "📵",
          reason: "Improve focus",
        },
        {
          habitName: "Deep Work 60 Minutes",
          emoji: "💻",
          reason: "Complete important work",
        },
      ];
    } // GOAL : MENTAL HEALTH
    else if (user.goal === "mental_health") {
      suggestions = [
        {
          habitName: "Meditation",
          emoji: "🧘",
          reason: "Reduce stress",
        },
        {
          habitName: "Journal Writing",
          emoji: "📖",
          reason: "Track emotions",
        },
        {
          habitName: "Evening Walk",
          emoji: "🌇",
          reason: "Relax your mind",
        },
      ];
    } // DEFAULT
    else {
      suggestions = [
        {
          habitName: "Drink Water",
          emoji: "💧",
          reason: "Healthy daily habit",
        },
        {
          habitName: "Read Book",
          emoji: "📚",
          reason: "Learn something new",
        },
      ];
    }
    //bmi category based habit
    if (bmiCategory === "Underweight") {
      suggestions.push({
        habitName: "Have Healthy Snacks",
        emoji: "🥜",
        reason: "Increase healthy calories",
      });

      suggestions.push({
        habitName: "Protein Intake Foods",
        emoji: "🥤",
        reason: "Support weight gain",
      });
    } else if (bmiCategory === "Normal") {
      suggestions.push({
        habitName: "Maintain Balanced Diet",
        emoji: "🥗",
        reason: "Keep healthy BMI",
      });
    } else if (bmiCategory === "Overweight") {
      suggestions.push({
        habitName: "Walk 8000 Steps",
        emoji: "🚶",
        reason: "Burn calories",
      });

      suggestions.push({
        habitName: "Reduce Sugar",
        emoji: "🍬",
        reason: "Weight management",
      });
    } else if (bmiCategory === "Obese") {
      suggestions.push({
        habitName: "Walk 10000 Steps",
        emoji: "🚶",
        reason: "Increase activity",
      });

      suggestions.push({
        habitName: "30 Min Cardio",
        emoji: "🏃",
        reason: "Fat burning",
      });

      suggestions.push({
        habitName: "Drink 3L Water",
        emoji: "💧",
        reason: "Stay hydrated",
      });
    } else {
      suggestions.push({
        habitName: "Daily go for walking",
        emoji: "🚶",
        reason: "Increase activity",
      });

      suggestions.push({
        habitName: "30 Min yoga and meditation",
        emoji: "🧘‍♀️🤸‍♀️",
        reason: "Improve Fitness And MentalHealth",
      });
    }
    res.status(200).json({
      success: true,
      bmi,
      bmiCategory,
      goal: user.goal,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Bug 1
// Habit becomes unchecked after changing page
// What should happen
// Day 1

// User clicks Mark
//         │
//         ▼
// Frontend calls toggleHabit(id)
//         │
//         ▼
// Backend updates MongoDB

// history = {
//    "2026-06-29": true
// }

// streak = 1
//         │
//         ▼
// Backend returns updated habit
//         │
//         ▼
// Redux stores updated habit
//         │
//         ▼
// User changes page
//         │
//         ▼
// loadHabits()
//         │
//         ▼
// MongoDB returns history

// history={
//  "2026-06-29":true
// }

// Card checks

// isDone = todo.history[today]

// ✔ Still marked

// This is the expected flow.

//

exports.getProfile = async (req, res) => {
  try {
    const user = await HabitifyUsers.findById(req.user.id).select("-password");
    const habits = await HabitModel.find({ createdBy: req.user.id });
    //calculate bmi
    let bmi = null;
    let bmiCategory = "Unknown";

    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;

      bmi = Number(
        (user.weight / (heightInMeters * heightInMeters)).toFixed(1),
      );

      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi < 25) bmiCategory = "Normal";
      else if (bmi < 30) bmiCategory = "Overweight";
      else bmiCategory = "Obese";
    }

    res.status(200).json({
      success: true,
      user,
      habits,
      bmi,
      bmiCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      dailyactivitylevel,
      goal,
      reminderTime,
    } = req.body;

    const user = await HabitifyUsers.findByIdAndUpdate(
      req.user.id,
      {
        age,
        gender,
        height,
        weight,
        dailyactivitylevel,
        goal,
        reminderTime,
      },
      { new: true },
    );

    res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.deleteProfile = async (req, res) => {
  try {
    await HabitModel.deleteMany({
      createdBy: req.user.id,
    });

    await HabitifyUsers.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin → sees own habits only
// User → sees own habits only
// Duplicate allowed across users
// Duplicate blocked inside same user
