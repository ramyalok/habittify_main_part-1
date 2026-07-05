const HabitModel = require("../model1/Addhabit");
const HabitifyUsers = require("../model1/users");

//1 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await HabitifyUsers.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//2 Get all habits
exports.getAllHabits = async (req, res) => {
  try {
    const habits = await HabitModel.find().populate(
      //Without populate MongoDB returnsOnly ObjectId.with populate it give info user&habit name .Admin immediately knows who owns the habit.
      "createdBy",
    "username email",
  );
  res.status(200).json({ success: true, data: habits });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
};
//3. delete user by id
exports.deleteUser = async (req, res) => {
  try {
    await HabitModel.deleteMany({
      createdBy: req.params.id, //Every habit created by that user is removed.
    });
    await HabitifyUsers.findByIdAndDelete(req.params.id);//ex mena account is removed from db and all habits created by user are also removed from db
    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//4 Change role
exports.changeRole = async (req, res) => {
  try {
    const user = await HabitifyUsers.findByIdAndUpdate(
      req.params.id,
      {
        role: req.body.role,
      },
      {
        returnDocument: "after",
      },
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getdashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await HabitifyUsers.countDocuments();

    const totalHabits = await HabitModel.countDocuments();

    const completedHabits = await HabitModel.countDocuments({
      completed: true,
    });

    const suggestedHabits = await HabitModel.countDocuments({
      isSuggested: true,
    });

    res.status(200).json({
      success: true,
      totalUsers,
      totalHabits,
      completedHabits,
      suggestedHabits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};