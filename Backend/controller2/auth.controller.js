const HabitifyUsers = require("../model1/users");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils1/generateToken");
// const sendMail = require("../utils1/sendMail");

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, password, role = "user" } = req.body;
    const email = req.body.email?.trim().toLowerCase();//it prevent runtime errors
    const UserExist = await HabitifyUsers.findOne({ email });
    if (UserExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await HabitifyUsers.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    console.log(req.body);
    res.status(200).json({
      message: "User registerd sucessfully",
      success: true,
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Login controller reached");
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    const registerdUser = await HabitifyUsers.findOne({ email });
    if (!registerdUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, registerdUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = generateToken(registerdUser._id);

    res.status(201).json({
      message: "Login Sucessfully",
      success: true,
      token,
      data: {
        id: registerdUser._id,
        username: registerdUser.username,
        email: registerdUser.email,
        role: registerdUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const {  password } = req.body;
   const email = req.body.email?.trim().toLowerCase();
    const user = await HabitifyUsers.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user Not found" });
    }
    if (!user.otpVerified) {
      return res.status(400).json({ message: "Verify OTP First" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // cleanup after otp enterd verified
    user.otp = null;
    user.otpExpire = null;
    user.otpVerified = false;

    await user.save();
    res.status(200).json({ success: true, message: "password Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async(req,res)=>{
try{
  // const{email}=req.body;
 const email = req.body.email?.trim().toLowerCase();
  const user = await HabitifyUsers.findOne({email});
  if(!user)
    {
    return res.status(404).json({message:"User Not Found"});
    }

    const generateOtp = Math.floor(100000+Math.random()*900000).toString();
    user.otp = generateOtp;

    user.otpExpire = Date.now()+ 5*60*1000;
    await user.save();
    res.status(200).json({success:true,message:"OTP is generated",otp:generateOtp})//send to front end
}
catch(error)
{
res.status(500).json({message:error.message})
}
}

// //in gmail.box
// exports.sendOtp = async (req, res) => {
//   const { email } = req.body;
//   const user = await HabitifyUsers.findOne({ email });
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   user.otp = otp;
//   user.otpExpire = Date.now() + 5 * 60 * 1000;
//   user.otpVerified = false;
//   await user.save();
//   await sendMail(email, otp);
//   res.status(200).json({
//     success: true,
//     message: "OTP sent to email",
//   });
// };

exports.verifyOtp = async (req, res) => {
  try {
    const {  otp } = req.body;
   const email = req.body.email?.trim().toLowerCase();
    const user = await HabitifyUsers.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.otpVerified = true;
    user.otp = null;

    await user.save();
    res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Password Reset Request

//  ↓
// Check otpVerified
//  ↓
// Hash Password
//  ↓
// Update Password
//  ↓
// Clear OTP
//  ↓
// Success
// Frontend
// (Enter Email)
//       ↓
// POST /users/sendotp
//       ↓
// Backend generates OTP
//       ↓
// Backend sends OTP in response
//       ↓
// Frontend shows OTP
//       ↓
// User enters OTP
//       ↓
// Frontend verifies
//       ↓
// Reset password

//this is genrate_otp verifed
// exports.forgotPassword =
// async(req,res)=>{

// try{

// const {
// email,
// password,
// otp
// }
// =
// req.body;

// const user =
// await HabitifyUsers.findOne({
// email
// });

// if(!user){

// return res.status(404).json({
// message:"User Not Found"
// });

// }

// // STEP 1 → generate OTP
// if(!otp){

// const generatedOtp =
// Math.floor(
// 100000+
// Math.random()*900000
// ).toString();

// user.otp =
// generatedOtp;

// user.otpExpire =
// Date.now()
// +
// 5*60*1000;

// await user.save();

// return res.status(200).json({

// success:true,

// message:"OTP Generated",

// otp:generatedOtp

// });

// }

// // STEP 2 → verify OTP
// if(

// user.otp!==otp

// ||

// user.otpExpire<Date.now()

// ){

// return res.status(400).json({

// message:"Invalid OTP"

// });

// }

// // STEP 3 → update password

// const hashedPassword =
// await bcrypt.hash(
// password,
// 10
// );

// user.password =
// hashedPassword;

// user.otp =
// null;

// user.otpExpire =
// null;

// await user.save();

// res.status(200).json({

// success:true,

// message:"Password Updated"

// });

// }

// catch(error){

// res.status(500).json({

// message:error.message

// });

// }

// };

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await HabitifyUsers.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "user Not found" });
//     }
//     if (!user.otpVerified) {
//       return res.status(400).json({ message: "Verify OTP First" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;

//     // cleanup
//     user.otp = null;
//     user.otpExpire = null;
//     user.otpVerified = false;

//     await user.save();
//     res.status(200).json({ success: true, message: "password Updated" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//in front end screen
// exports.sendOtp = async(req,res)=>{
// try{
//   const{email}=req.body;
//   const user = await HabitifyUsers.findOne({email});
//   if(!user)
//     {
//     return res.status(404).json({message:"User Not Found"});
//     }

//     const generateOtp = Math.floor(100000+Math.random()*900000).toString();
//     user.otp = generateOtp;

//     user.otpExpire = Date.now()+ 5*60*1000;
//     await user.save();
//     res.status(200).json({success:true,message:"OTP is generated",otp:generateOtp})//send to front end
// }
// catch(error)
// {
// res.status(500).json({message:error.message})
// }
// }

// exports.verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const user = await HabitifyUsers.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }
//     if (user.otp !== otp || user.otpExpire < Date.now()) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }
//     user.otpVerified = true;
//     await user.save();
//     res.status(200).json({ success: true, message: "OTP verified" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
