const path = require("path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");

// Controller function to render the home page
exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "html", "homePage.html"));
};

// Controller function to add an expense
exports.addExpense = async (req, res, next) => {
  const { date, category, description, amount } = req.body;
  let t; // Declare the transaction variable

  try {
    t = await sequelize.transaction(); // Create a new transaction

    // Increment totalExpenses for the user
    await User.increment('totalExpenses', {
      by: amount,
      where: { id: req.user.id },
      transaction: t,
    });

    // Create a new expense record
    await Expense.create({
      date: date,
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id,
    }, {
      transaction: t,
    });

    // Commit the transaction if all operations succeed
    await t.commit();

    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

    if (t) {
      // Rollback the transaction if an error occurs
      await t.rollback();
    }

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
  let t; // Declare the transaction variable

  try {
    const id = req.params.id;
    const expense = await Expense.findByPk(id);

    t = await sequelize.transaction(); // Create a new transaction

    // Decrement totalExpenses for the user
    await User.decrement('totalExpenses', {
      by: expense.amount,
      where: { id: req.user.id },
      transaction: t,
    });

    // Delete the expense
    await Expense.destroy({ where: { id: id, userId: req.user.id }, transaction: t });

    // Commit the transaction if all operations succeed
    await t.commit();

    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

    if (t) {
      // Rollback the transaction if an error occurs
      await t.rollback();
    }

    res.status(500).send("An error occurred while deleting the expense.");
  }
};


// Controller function to edit an expense
exports.editExpense = async (req, res, next) => {
  let t; // Declare the transaction variable

  try {
    const id = req.params.id;
    const { category, description, amount } = req.body;

    const expense = await Expense.findByPk(id);
    const amountDifference = amount - expense.amount;

    t = await sequelize.transaction(); // Create a new transaction

    // Increment or decrement totalExpenses for the user based on the amount difference
    await User.increment('totalExpenses', {
      by: amountDifference,
      where: { id: req.user.id },
      transaction: t,
    });

    // Update the expense
    await Expense.update(
      {
        category: category,
        description: description,
        amount: amount,
      },
      { where: { id: id, userId: req.user.id }, transaction: t }
    );

    // Commit the transaction if all operations succeed
    await t.commit();

    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

    if (t) {
      // Rollback the transaction if an error occurs
      await t.rollback();
    }

    res.status(500).send("An error occurred while editing the expense.");
  }
};

