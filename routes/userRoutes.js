const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.use(express.static("public"));

router.get("/signUp", userController.getSignUpPage);
router.post("/signUp", userController.postUserSignUp);

router.get("/", userController.getLoginPage);
router.post("/login", userController.postUserLogin);

module.exports = router;