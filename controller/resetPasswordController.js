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
    const recepientEmail = await User.findOne({ where: { email: email } });

    if (!recepientEmail) {
      return res
        .status(404)
        .json({ message: "Please provide the registered email!" });
    }

    // Create a new password reset request record in the database
    const resetRequest = await ResetPassword.create({
      id: requestId,
      isActive: true,
      userId: recepientEmail.dataValues.id,
    });

    // Configure SendinBlue API for sending the email
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.RESET_PASSWORD_API_KEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "mukulpathak4@gmail.com",
      name: "Mukul",
    };
    const receivers = [
      {
        email: email,
      },
    ];

    // Send the password reset email with a link
    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      To: receivers,
      subject: "Expense Tracker Reset Password",
      textContent: "Link Below",
      htmlContent: `<h3>Hi! We received a request from you to reset the password. Here is the link below:</h3>
      <a href="http://localhost:3000/password/resetPasswordPage/${requestId}">Click Here</a>`,
      params: {
        requestId: requestId,
      },
    });

    return res.status(200).json({
      message:
        "Link for resetting the password has been successfully sent to your email address!",
    });
  } catch (error) {
    console.log("error");
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
    const requestId = req.headers.referer.split("/");
    const password = req.body.password;

    // Check if the password reset request exists and is active
    const checkResetRequest = await ResetPassword.findAll({
      where: { id: requestId[requestId.length - 1], isActive: true },
    });

    if (checkResetRequest[0]) {
      const userId = checkResetRequest[0].dataValues.userId;

      // Deactivate the password reset request
      const result = await ResetPassword.update(
        { isActive: false },
        { where: { id: requestId } }
      );

      // Hash the new password
      const newPassword = await hashPassword(password);

      // Update the user's password
      const user = await User.update(
        { password: newPassword },
        { where: { id: userId } }
      );

      return res
        .status(200)
        .json({ message: "Password has been successfully changed!" });
    } else {
      return res
        .status(409)
        .json({ message: "Link has already been used once. Request a new link!" });
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