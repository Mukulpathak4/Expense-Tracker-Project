const path = require("path");
const User = require("../models/userModel");


const getSignUpPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "frontend", "html", "signup.html"));
  } catch (error) {
    console.log(error);
  }
};

const postUserSignUp = async (req,res,next)=>{
    try {
      
      const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
      
  
      if (!email) {
          throw new Error('email is mandatory !')
      }
      const data = await User.create({
          name : name,
          email : email,
          password : password
      })
  
      res.status(201).json({ newUserDetail: data });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
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
      if (user.password != password)  {
            return res.status(401).json({
              success: false,
              message: "Password Incorrect!",
            });
          }
          else {
            return res.status(200).json({
              success: true,
              message: "Login Successful!",
            });
          }
        });
      } 
  catch (error) {
    console.log(error);
  }
};


module.exports = {
    postUserSignUp,
    getSignUpPage,
    getLoginPage,
    postUserLogin
}