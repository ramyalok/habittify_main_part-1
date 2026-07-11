const HabitModel = require("../model1/Addhabit");
const HabitifyUsers = require("../model1/users");

//🤩 to view the profile
exports.getProfile = async (req, res) => {
  try {
    const user = await HabitifyUsers.findById(req.user.id).select("-password");//finds logged user
    const habits = await HabitModel.find({ createdBy: req.user.id });//logged user habits
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
//🤩 to update(add) user details
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
      // { new: true },//it is deprecated and replaced with returnDocument: "after" in mongoose 7
      {
        returnDocument: "after",
      },
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
//🤩 to generate habits based on goal and bmi category after profile update 
exports.generateHabits = async (req, res) => {
  //after user profile complete genrate habits based on goal and bmi category
  try {
    const user = await HabitifyUsers.findById(req.user.id); ////finds logged user
    console.log("USER FROM DB", user); //username,email,password,rolr,proimg,age,he,we,,gender,goal,dailyactlevel

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // console.log("CHECK PROFILE");

    // console.log({
    //   age: user.age,
    //   height: user.height,
    //   weight: user.weight,
    //   goal: user.goal,
    //   dailyactivitylevel: user.dailyactivitylevel,
    // });

    if (
      !user.age ||
      !user.height ||
      !user.weight ||
      !user.goal ||
      !user.dailyactivitylevel
    ) {
      return res.status(200).json({
        success: true,
        profileCompleted: false,
        suggestions: [],
        bmi: null,
        bmiCategory: "",
        message: "Complete your profile first",
      });
    }
    //goal based habits suggested
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
    // -----------------------------// Calculate BMI// -----------------------------
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
    console.log(suggestions); //[{ habitName: 'Morning Workout', emoji: '🏃', reason: 'Stay active' },{},{}]
    res.status(200).json({
      success: true,
      bmi,
      bmiCategory,
      goal: user.goal,
      suggestions,
      profileCompleted: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//custom habits are created by user and stored in db and can be viewed,updated,deleted by user only
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

//get all habits of logged user and admin
exports.getHabit = async (req, res) => {
  try {
    const habits = await HabitModel.find({ createdBy: req.user.id });//allhabits owned by kumar user
    res
      .status(200)
      .json({ success: true, message: "All Habits ", data: habits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update habit of logged user and admin
exports.updateHabit = async (req, res) => {
  try {
    const updatedHabit = await HabitModel.findOneAndUpdate(
      {
        _id: req.params.id,//habit id
        createdBy: req.user.id,//user id
      },
      req.body,
      { returnDocument: "after", runValidators: true },
      //returnDocument: "after" → returns the updated document after update, 
      // runValidators: true → runs the validators defined in the schema to validate the updated data
    );
    //Update only//if logged user owns habit//User A can update only own habit
    //Only _id → findByIdAndUpdate()/ /Multiple conditions → findOneAndUpdate()
    if (!updatedHabit) {
      return res.status(404).json({ message: "Habit Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Habit Updated successfully",
      data: updatedHabit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete habit of logged user and admin
exports.deleteHabit = async (req, res) => {
  try {
    const deletedHabit = await HabitModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!deletedHabit) {
      return res.status(404).json({ message: "habit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
      data: deletedHabit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//toggle habit of logged user and admin
exports.toggleHabit = async (req, res) => {
  try {
    const habit = await HabitModel.findOne({
      _id: req.params.id, //habit id
      createdBy: req.user.id, //user id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }
    const today = new Date().toLocaleDateString("en-CA"); //today date in format YYYY-MM-DD
    if (!habit.history) {
      habit.history = {};
    }
    // Toggle today's completion
    habit.history[today] = !habit.history[today]; //habit.history becoms true {"2026-07-05":true,"2026-07-06":true}
    habit.markModified("history"); //Mongoose sometimes doesn't detect changes inside plain objects so we tell mongoose history changed and needs to be saved
    habit.completed = habit.history[today]; //If today's history is true then habit.completed is true else false
    //completed is only today's status.history stores every day's status.history tells you every day the habit was completed.
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
        streak++; //How many consecutive days have you completed the habit until today?
        current.setDate(current.getDate() - 1); //code starts from today and walks backward one day at a time. today date is july 4  july 3,2,1 =true sreak is 3 (3 consective days)// but today false strk 0
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
// Another Example
//{2026-07-04 : true2026-07-03 : true2026-07-02 : true2026-07-01 : false} 1 2 3 4is not complte = final streak 3
// History{"2026-07-04": true, "2026-07-03": false, "2026-07-02": true}
// Loop Day 4 ✓streak=1 Day 3 ✗ STOP =Final streak = 1Even though July 2 was completed, the streak is only 1 because a streak must be continuous.


exports.deleteProfile = async (req, res) => {
  try {
    await HabitModel.deleteMany({
      createdBy: req.user.id, //Every habit created by that user is removed.
    });

    await HabitifyUsers.findByIdAndDelete(req.user.id);//ex mena account is removed from db and all habits created by user are also removed from db

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

exports.uploadProfileImage = async (req, res) => {
  try {
    console.log("===== UPLOAD START =====");
    console.log("req.file =", req.file);
    console.log("req.body =", req.body);
    console.log("req.user =", req.user);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image received",
      });
    }

    const user = await HabitifyUsers.findById(req.user.id);

    user.profileImage = "/uploads/profile/" + req.file.filename;

    await user.save();

    res.status(200).json({
      success: true,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Admin → sees own habits only
// User → sees own habits only
// Duplicate allowed across users
// Duplicate blocked inside same user
