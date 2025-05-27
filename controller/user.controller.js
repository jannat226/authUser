import User from "../model/User.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Add this line

//   // Validate
//   // check if its already existing
//   // if not then create a user in db
//   // generate a verification token
//   // save token in db
//   // send token as email to user
//   // send sucess status to user

const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  // // For now just send success
  // return res.status(201).json({
  //   msg: "User registered",
  //   data: { name, email },
  // });
  // if exist
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        msg: "User not created",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;
    await user.save();

    // SEND EMAIL

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
    console.log("Mail sent!");

    const mailOptions = {
      from: process.env.MAILTRAP_SENDERMAIL,
      to: user.email,
      subject: "Verify your email ✔",
      text: `Please check the following link : ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain‑text body
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      msg: "User registered Successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      msg: "User not registered",
      error,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  // get token from url
  // validate
  // find user based on token
  // if not
  // set isverified field to true
  // remove verification token
  // return response
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      msg: "Invalid Token",
    });
  }
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({
      msg: "Invalid Token",
    });
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  return res.status(200).json({
    msg: "Email verified successfully!",
    success: true,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      msg: "all fields are required!",
    });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        msg: "Invalid email",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "invalid username or password",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        msg: "Please verify your email before logging in.",
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "shhh", {
      expiresIn: "24h",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      msg: "User not registered",
      error,
      success: false,
    });
  }
};

export { registerUser, verifyUser, loginUser };
