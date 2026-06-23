const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
app.use(cors());

const connectDB = require("./config1/db.config1");
connectDB();

app.use(express.json());

// routes connection

//  1.login/register/forgotpassword
 const authuserroutes = require("./routes3/auth.routes3");
  app.use("/users", authuserroutes);

// 2.habit crud
 const habitroutes = require("./routes3/habit.routes");
 app.use("/habit", habitroutes);

// 3. profile view// get = http://localhost:5000/userProfile/getprofile
// const userProfileroutes = require("./routes4/userProfile.route");
// app.use("/userProfile", userProfileroutes);

//basic handler for server 500code
  const errorHandler = require("./middleware4/error.middleware");
  app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
