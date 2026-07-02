const HabitModel = require("../model1/Addhabit");
const HabitifyUsers = require("../model1/users");

//1 Get all users
exports.getAllUsers = async (req, res) => {
  const users = await HabitifyUsers.find().select("-password");
  res.json(users);
};
//2 Get all habits
exports.getAllHabits = async (req, res) => {
  const habits = await HabitModel.find().populate(
    "createdBy",
    "username email",
  );
  res.json(habits);
};
//3. delete user by id
exports.deleteUser = async (req, res) => {
  await HabitModel.deleteMany({
    createdBy: req.params.id,
  });
  await HabitifyUsers.findByIdAndDelete(req.params.id);
  res.json({
    success: true,
    message: "User deleted",
  });
};
//4 Change role
exports.changeRole = async (req, res) => {
  const user = await HabitifyUsers.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true },
  );
  res.json(user);
};

//getdashboard
exports.getDashboard = async (req, res) => {
  const totalUsers = await HabitifyUsers.countDocuments(); //Total Users
  const totalHabits = await HabitModel.countDocuments(); //Total Habits
  //Completed Habits
  const completedHabits = await HabitModel.countDocuments({ completed: true });
  //suggested Habits
   const suggestedHabits = await HabitModel.countDocuments({ isSuggested: true });
    res.json({
      success: true,
      totalUsers,
      totalHabits,
      completedHabits,
      suggestedHabits,
    });
};