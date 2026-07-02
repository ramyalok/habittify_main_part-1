const jwt = require("jsonwebtoken");
const HabitifyUser = require("../model1/users");

// /AUTH MIDDLEWARE VERIFY TOKEN
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" }); // //login required to verify token no login so unauthorized
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("iam decoded id ", decoded);
    const user = await HabitifyUser.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found after login token verified(someothersToken)",
      });
    }
    console.log(decoded); //iam decoded id  { id: '6a2c47cb2be72542423f4144', iat: 1781351678, exp: 1781956478 }
    req.user = user;//your controller can directly access--req.user.id-req.user.username-req.user.email-req.user.role-req.user.goal-req.user.weight

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};
