const express = require("express");
const app = express();
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
app.use(cors());

const connectDB = require("./config1/db.config1");
connectDB();

app.use(express.json());

// routes connection

//  1.login/register/forgotpassword
  //user routes
 const authuserroutes = require("./routes3/auth.routes3");
  app.use("/users", authuserroutes);
  //admin routes
  const adminroutes = require("./routes3/admin.routes");
  app.use("/admin", adminroutes);

// 2.habit crud
 const habitroutes = require("./routes3/habit.routes");
 app.use("/habit", habitroutes);

// 3. profile view// get = http://localhost:5000/userProfile/getprofile
// const userProfileroutes = require("./routes4/userProfile.route");
// app.use("/userProfile", userProfileroutes);

//basic handler for server 500code
  const errorHandler = require("./middleware4/error.middleware");
  app.use(errorHandler);
  
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
