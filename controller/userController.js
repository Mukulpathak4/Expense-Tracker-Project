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

module.exports = {
    postUserSignUp,
    getSignUpPage
}