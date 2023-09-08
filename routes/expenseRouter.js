const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expenseController");
const userAuthentication = require("../authentication/auth");

router.use(express.static("public"));

router.get("/", expenseController.getHomePage);
router.get(
  "/getAllExpenses",
  userAuthentication,
  expenseController.getAllExpenses
);
router.get(
  "/deleteExpense/:id",
  userAuthentication,
  expenseController.deleteExpense
);

router.post("/addExpense", userAuthentication, expenseController.addExpense);
router.post(
  "/editExpense/:id",
  userAuthentication,
  expenseController.editExpense
);

module.exports = router;