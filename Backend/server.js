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

// image upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes connection

// user routes
const authuserroutes = require("./routes3/auth.routes3");
app.use("/users", authuserroutes);

// admin routes
const adminroutes = require("./routes3/admin.routes");
app.use("/admin", adminroutes);

// habit routes
const habitroutes = require("./routes3/habit.routes");
app.use("/habit", habitroutes);

// review routes
const reviewroutes = require("./routes3/review.routes");
app.use("/review", reviewroutes);

//contact routes 
const contactroutes = require("./routes3/contact.routes");
app.use("/contact",contactroutes);

// error middleware
const errorHandler = require("./middleware4/error.middleware");
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
