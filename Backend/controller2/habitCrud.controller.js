const HabitModel = require ("../model1/Addhabit");
const HabitifyUsers = require("../model1/users");
exports.addHabit =  async(req,res)=>{

    try{
      const { habitName, emoji, isSuggested } = req.body;
      // check duplicate ONLY for current user or admin
      const IssameHabit = await HabitModel.findOne({ habitName,createdBy:req.user.id });
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
      res
        .status(200)
        .json({
          success: true,
          message: "Habits added successfully",
          data: newHabit,
        });
    }
    catch(err){
      console.log(err);
    res.status(500).json({ message: err.message });
    }
}
// So Habit needs ownership.User A → only Exercise //User B → only Reading
// Habit project should use 😎createdBy 😎if:Every user owns their own habits

exports.getHabit = async(req,res)=>{

    try{
    const habits = await HabitModel.find({createdBy:req.user.id});
    res.status(200).json({success:true,message:"All Habits ",data:habits});
    }
    catch(error)
    {
      res.status(500).json({message:error.message});
    }

}

exports.updateHabit = async(req,res)=>{

    try{
        const updatedHabit = await HabitModel.findOneAndUpdate(
        {
        _id:req.params.id,
        createdBy:req.user.id
        },
        req.body,
        {returnDocument:"after",runValidators:true}
    );
//Update only//if logged user owns habit//User A can update only own habit
//Only _id → findByIdAndUpdate()/ /Multiple conditions → findOneAndUpdate()  
if(!updatedHabit)
    {
        return res.status(404).json({message:"Habit Not Found"})
    }
    
    res.status(200).json({success:true,message:"Habit Updated successfully",data:updatedHabit});

    }
    catch(error){
     res.status(500).json({ message: error.message });
    }
}

exports.deleteHabit = async(req,res)=>{
    try{
        const deletedHabit= await HabitModel.findOneAndDelete({
        _id:req.params.id,
        createdBy:req.user.id
        })

        if (!deletedHabit) {
          return res.status(404).json({message:"habit not found"});
        }

        res.status(200).json({success:true,message:"Habit deleted successfully",data:deletedHabit})
    }
    catch(error){
        res.status(500).json({ message: err.message });  
    }
}

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

    const today = new Date().toISOString().split("T")[0];

    if (!habit.history) {
      habit.history = {};
    }

    // Toggle today's completion
    habit.history[today] = !habit.history[today];

    // Update completed field
    habit.completed = habit.history[today];

    // Calculate streak
    let streak = 0;
    let current = new Date();

    while (true) {
      const dateStr = current.toISOString().split("T")[0];

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

    let suggestions = [];

    switch (user.goal) {
      case "weight_loss":
        suggestions = [
          {
            habitName: "Walk 10000 Steps",
            emoji: "🚶",
            reason: "Burn calories daily",
          },
          {
            habitName: "Drink 3L Water",
            emoji: "💧",
            reason: "Stay hydrated",
          },
          {
            habitName: "Exercise 30 Minutes",
            emoji: "🏋️",
            reason: "Improve fitness",
          },
          {
            habitName: "Avoid Sugary Drinks",
            emoji: "🏋️",
            reason: "Balanced diet",
          },
        ];
        break;
      case "weight_gain":
        suggestions = [
          {
            habitName: "Protein Rich Breakfast",
            emoji: "🍳",
            reason: "Build muscle",
          },
          {
            habitName: "Strength Training",
            emoji: "🏋️",
            reason: "Increase muscle mass",
          },
          {
            habitName: "Eat Every 3 Hours",
            emoji: "🍽️",
            reason: "Increase calorie intake",
          },
        ];
        break;

      case "fitness":
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
        ];
        break;
      case "study":
        suggestions = [
          {
            habitName: "Read 20 Pages",
            emoji: "📚",
            reason: "Increase knowledge",
          },
          {
            habitName: "Plan Daily Tasks",
            emoji: "📝",
            reason: "Stay organized",
          },
          {
            habitName: "Practice Coding",
            emoji: "💻",
            reason: "Improve skills",
          },
        ];
        break;
      case "productivity":
        suggestions = [
          {
            habitName: "Read 20 Pages",
            emoji: "📚",
            reason: "Increase knowledge",
          },
          {
            habitName: "Plan Daily Tasks",
            emoji: "📝",
            reason: "Stay organized",
          },
          {
            habitName: "Practice Coding",
            emoji: "💻",
            reason: "Improve skills",
          },
        ];
        break;

      case "mental_health":
        suggestions = [
          {
            habitName: "Meditation",
            emoji: "🧘",
            reason: "Reduce stress",
          },
          {
            habitName: "Journal Writing",
            emoji: "📔",
            reason: "Track emotions",
          },
          {
            habitName: "Evening Walk",
            emoji: "🌇",
            reason: "Relax mind",
          },
        ];
        break;
      default:
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

    res.status(200).json({
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await HabitifyUsers.findById(req.user.id).select("-password");

    const habits = await HabitModel.find({
      createdBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      user,
      habits,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { age, gender, height, weight, dailyactivitylevel, goal, reminderTime } =
      req.body;

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

    res.status(200).json({success:true,message:"User updated successfully",data:user});
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