const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.use(express.static("public"));

router.get("/", userController.getSignUpPage);
router.post("/signUp", userController.postUserSignUp);

module.exports = router;