// Import necessary modules and dependencies.
const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to generate an access token for a user.
function generateAccessToken(_id, email) {
  // Create a JWT token with user information and the correct secret key.
  return jwt.sign({ userId: _id, email: email }, process.env.RAZORPAY_KEY_SECRET);
}

// Middleware to check if a user is a premium user.
const isPremiumUser = (req, res, next) => {
  // Check if the user's "isPremiumUser" flag is true.
  if (req.user.isPremiumUser) {
    return res.json({ isPremiumUser: true });
  }
};

// Function to render the login page.
const getLoginPage = (req, res, next) => {
  // Send the login page HTML file to the client.
  res.sendFile(path.join(__dirname, "../", "public", "html", "user.html"));
};

// Function to handle user signup.
const postUserSignUp = async (req, res, next) => {
  try {
    // Extract user data from the request body.
    const { name, email, password } = req.body;

    // Check if a user with the same email already exists in the database.
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // If a user with the same email exists, send a conflict (status 409) response.
      return res.status(409).json({ message: 'This email is already taken. Please choose another one.' });
    }

    // If no user with the same email exists, hash the user's password securely.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database.
    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Send a success (status 200) response after user creation.
    return res.status(200).send(
      `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while creating the user.");
  }
};

// Function to handle user login.
const postUserLogin = async (req, res, next) => {
<<<<<<< HEAD
  try {
    // Extract login email and password from the request body.
    const email = req.body.loginEmail;
    const password = req.body.loginPassword;

    // Check if a user with the provided email exists in the database.
    const user = await User.findOne({ email: email });

    if (user) {
      // If a user with the provided email exists, compare the hashed password.
      const result = await bcrypt.compare(password, user.password);

      if (result) {
        // If the password matches, send a success (status 200) response with an access token.
        return res.status(200).json({
          success: true,
          message: "Login successful!",
          token: generateAccessToken(user.id, user.email),
        });
      } else {
        // If the password is incorrect, send an unauthorized (status 401) response.
=======
  // Extract login email and password from the request body.
  const { loginEmail, loginPassword } = req.body;

  try {
    // Check if a user with the provided email exists in the database.
    const user = await User.findOne({ email: loginEmail });

    if (user) {
      // If a user with the provided email exists, compare the hashed password.
      const passwordMatch = await bcrypt.compare(loginPassword, user.password);

      if (passwordMatch) {
        // If the password matches, send a success (status 200) response with an access token.
        const token = generateAccessToken(user._id, user.email);
        return res.status(200).json({
          success: true,
          message: "Login successful!",
          token: token,
        });
      } else {
        // If the password is incorrect, send a unauthorized (status 401) response.
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
        return res.status(401).json({
          success: false,
          message: "Password incorrect!",
        });
      }
    } else {
      // If no user with the provided email exists, send a not found (status 404) response.
      return res.status(404).json({
        success: false,
        message: "User doesn't exist!",
      });
    }
  } catch (err) {
    console.error(err);
<<<<<<< HEAD
    res.status(500).send("An error occurred while processing the login.");
=======
    res.status(500).json({ success: false, message: "Something went wrong!" });
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
  }
};

// Export the defined functions for use in other parts of the application.
module.exports = {
  generateAccessToken,
  getLoginPage,
  postUserLogin,
  postUserSignUp,
  isPremiumUser,
};
