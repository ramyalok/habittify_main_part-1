 
const mongoose = require("mongoose");

// console.log("PORT =", process.env.PORT);
// console.log("JWT_SECRET =", process.env.JWT_SECRET);
// console.log("MONGODB_ATLAS =", process.env.MONGODB_ATLAS);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;