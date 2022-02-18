import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
require("dotenv").config();
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  gender: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: 6,
  },

  token: {
    type: String,
  },

  role: {
    type: String,
    required: true,
  },
});
//generating auth token
// userSchema.methods.generateAuthToken = async function (attendence_id) {
//   const user = this; 
//   const attend_id = attendence_id.toString();
//   const token = jwt.sign(
//     { _id: user._id.toString(), role: user.role , attendence_id:attend_id},
//     process.env.SECRET_KEY
//   );
//   user.token = token
//   await user.save();
//   return token;
// };
//find if email and password are exists
// userSchema.statics.findByCredentials = async (email, password,res) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(404).json({messsage:'User Not Found', error:"NOT_FOUND"});
//   }
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({messsage:'password is incorrect', error:"AUTHENTICATION_ERROR"});
//   }
//   return user;
// };
//hash the plain text password
// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });
export default mongoose.model("User", userSchema);
