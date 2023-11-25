const path = require("path");
const User = require("../models/userModel");
const ResetPassword = require("../models/resetPasswordModel");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

// Function to hash a password using bcrypt
const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

// Controller function to render the "forgot password" page
const forgotPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "html", "forgot.html")
      );
  } catch (error) {
    console.log(error);
  }
};

// Controller function to send a password reset email
const sendMail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const requestId = uuidv4();

    // Find the recipient's email in the database
    const recipientUser = await User.findOne({ email: email });

    if (!recipientUser) {
      return res.status(404).json({ message: "Please provide the registered email!" });
    }

    // Create a new password reset request record in the database
    const resetRequest = await ResetPassword.create({
      _id: requestId,
      isActive: true,
      user: recipientUser._id,
    });

    // Configure nodemailer for sending the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send the password reset email with a link
    const emailResponse = await transporter.sendMail({
      from: '"Expense Tracker" <mukulpathak4@gmail.com>',
      to: email,
      subject: "Expense Tracker Reset Password",
      html: `<h3>Hi! We received a request from you to reset the password. Here is the link below:</h3>
      <a href="http://localhost:3200/password/resetPasswordPage/${requestId}">Click Here</a>`,
    });

    return res.status(200).json({
      message: "Link for resetting the password has been successfully sent to your email address!",
    });
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: "Failed to change password" });
  }
};

// Controller function to render the "reset password" page
const resetPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "html", "resetPassword.html")
      );
  } catch (error) {
    console.log(error);
  }
};

// Controller function to update the password after a password reset
const updatePassword = async (req, res, next) => {
  try {
    const requestId = req.headers.referer.split("/").pop();
    const password = req.body.password;

    // Check if the password reset request exists and is active
    const resetRequest = await ResetPassword.findOne({ _id: requestId, isActive: true });

    if (resetRequest) {
      const userId = resetRequest.user;

      // Deactivate the password reset request
      await ResetPassword.findByIdAndUpdate(resetRequest._id, { isActive: false });

      // Hash the new password
      const newPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      await User.findByIdAndUpdate(userId, { password: newPassword });

      return res.status(200).json({ message: "Password has been successfully changed!" });
    } else {
      return res.status(409).json({ message: "Link has already been used once. Request a new link!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ message: "Failed to change password!" });
  }
};

module.exports = {
  updatePassword,
  resetPasswordPage,
  sendMail,
  forgotPasswordPage
};