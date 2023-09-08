const path = require("path");
const Expense = require("../models/expenseModel"); // Import the Expense model
const database = require("../util/database");

// Controller function to render the home page
exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "html", "homePage.html"));
};

// Controller function to add an expense
exports.addExpense = (req, res, next) => {
  const date = req.body.date;
  const category = req.body.category;
  const description = req.body.description;
  const amount = req.body.amount;

  // Create a new expense record in the database
  Expense.create({
    date: date,
    category: category,
    description: description,
    amount: amount,
    userId: req.user.id, // Associate the expense with the current user
  })
    .then((result) => {
      res.status(200);
      res.redirect("/homePage"); // Redirect to the home page after adding an expense
    })
    .catch((err) => console.log(err));
};

// Controller function to get all expenses for the current user
exports.getAllExpenses = (req, res, next) => {
  // Find all expenses in the database associated with the current user
  Expense.findAll({ where: { userId: req.user.id } })
    .then((expenses) => {
      res.json(expenses); // Respond with JSON containing the user's expenses
    })
    .catch((err) => {
      console.log(err);
    });
};

// Controller function to delete an expense
exports.deleteExpense = (req, res, next) => {
  const id = req.params.id;
  console.log(id, req.user.id);
  
  // Delete the expense with the specified ID associated with the current user
  Expense.destroy({ where: { id: id, userId: req.user.id } })
    .then((result) => {
      res.redirect("/homePage"); // Redirect to the home page after deleting the expense
    })
    .catch((err) => console.log(err));
};

// Controller function to edit an expense
exports.editExpense = (req, res, next) => {
  const id = req.params.id;
  console.log(req.body);
  const category = req.body.category;
  const description = req.body.description;
  const amount = req.body.amount;

  // Update the expense with the specified ID associated with the current user
  Expense.update(
    {
      category: category,
      description: description,
      amount: amount,
    },
    { where: { id: id, userId: req.user.id } }
  )
    .then((result) => {
      res.redirect("/homePage"); // Redirect to the home page after editing the expense
    })
    .catch((err) => console.log(err));
};
