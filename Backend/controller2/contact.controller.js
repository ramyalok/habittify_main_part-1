const User = require("../model1/users");
const Contact = require("../model1/Contact");

// User submits suggestion
exports.createSuggestion = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const suggestion = await Contact.create({
      user: req.user.id,
      name: user.username,
      email: user.email,
      message: req.body.message,
    });

    res.status(201).json({
      success: true,
      message: "Suggestion submitted successfully",
      data: suggestion,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//admin sees all suggestion
exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Contact.find()
      .populate("user", "username email profileImage")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteSuggestion = async (req, res) => {
  try {
    const deletedSuggestion = await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: deletedSuggestion,
      message: "Suggestion deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
