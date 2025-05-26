import User from "../model/User.model.js";
import nodemailer from "nodemailer";
// const registerUser = async (req, res) => {
//   // res.send("registered!");
//   // // get data
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//     console.log("hey there");
//     return res.status(400).json({
//       message: "All fields are required!!!",
//     });
//   }

//   // Validate
//   // check if its already existing
//   // if not then create a user in db
//   // generate a verification token
//   // save token in db
//   // send token as email to user
//   // send sucess status to user
// };
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
      return res.status(201).json({
        msg: "User already exist",
      });
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

    const token = crypto.randomByte(32).toString("hex");
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
};

export { registerUser, verifyUser };
