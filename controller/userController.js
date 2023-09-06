const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const getSignUpPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "frontend", "html", "signup.html"));
  } catch (error) {
    console.log(error);
  }
};

const postUserSignUp = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    await User.findOne({ where: { email: email } })
      .then((user) => {
        if (user) {
          res
            .status(409)
            .send(
              `<script>alert('This email is already taken. Please choose another one.'); window.location.href='/'</script>`
            );
        } else {
          bcrypt.hash(password, 10, async (err, hash) => {
            await User.create({
              name: name,
              email: email,
              password: hash,
            });
          });
          res
            .status(200)
            .send(
              `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
            );
        }
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
}

const getLoginPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "frontend", "html", "signin.html"));
  } catch (error) {
    console.log(error);
  }
};

const postUserLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    await User.findOne({ where: { email: email } }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: "Something went Wrong!" });
          }
          if (result == true) {
            return res.status(200).json({
              success: true,
              message: "Login Successful!",
            });
          } else {
            return res.status(401).json({
              success: false,
              message: "Password Incorrect!",
            });
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User doesn't Exists!",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
    postUserSignUp,
    getSignUpPage,
    getLoginPage,
    postUserLogin
}