const path = require("path");
const Expense = require("../models/expenseModel");
const database = require("../util/database");
const User = require("../models/userModel");

// Controller function to render the home page
exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "html", "homePage.html"));
};

// Controller function to add an expense
exports.addExpense = async (req, res, next) => {
  try {
    const { date, category, description, amount } = req.body;

    await User.increment('totalExpenses', {
      by: amount,
      where: { id: req.user.id },
    });

    await Expense.create({
      date: date,
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id,
    });

    res.redirect("/homePage");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while adding the expense.");
  }
};

// Controller function to get all expenses for the current user
exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching expenses.");
  }
};

// Controller function to delete an expense
exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const expense = await Expense.findByPk(id);

    await User.decrement('totalExpenses', {
      by: expense.amount,
      where: { id: req.user.id },
    });

    await Expense.destroy({ where: { id: id, userId: req.user.id } });
    res.redirect("/homePage");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the expense.");
  }
};

// Controller function to edit an expense
exports.editExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { category, description, amount } = req.body;

    const expense = await Expense.findByPk(id);
    const amountDifference = amount - expense.amount;

    await User.increment('totalExpenses', {
      by: amountDifference,
      where: { id: req.user.id },
    });

    await Expense.update(
      {
        category: category,
        description: description,
        amount: amount,
      },
      { where: { id: id, userId: req.user.id } }
    );

    res.redirect("/homePage");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while editing the expense.");
  }
};
