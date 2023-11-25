const path = require("path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const mongoose = require("../util/database");

// Controller function to render the home page
const getHomePage = (req, res, next) => {
  // Serve the HTML file for the home page
  res.sendFile(path.join(__dirname, "../", "public", "html", "homePage.html"));
};

// Controller function to add an expense
const addExpense = async (req, res, next) => {
  const { date, category, description, amount } = req.body;

  try {
    // Create a new expense record
    const expense = new Expense({
      date: date,
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id,
    });

    // Save the expense to the database
    await expense.save();

    // Redirect to the home page after adding the expense
    res.redirect("/homePage");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while adding the expense.");
  }
};


// Controller function to get all expenses for the current user
const getAllExpenses = async (req, res, next) => {
  try {
    // Fetch all expenses associated with the current user
    const expenses = await Expense.find({ user: req.user._id });

    // Respond with the list of expenses in JSON format
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching expenses.");
  }
};


// Controller function to get expenses for pagination
const getAllExpensesforPagination = async (req, res, next) => {
  try {
    const pageNo = req.params.page;
    const limit = 10;
    const skip = (pageNo - 1) * limit;

    // Count the total number of expenses for the current user
    const totalExpenses = await Expense.countDocuments({
      user: req.user._id,
    });

    // Calculate the total number of pages needed for pagination
    const totalPages = Math.ceil(totalExpenses / limit);

    // Fetch expenses for the current page
    const expenses = await Expense.find({
      user: req.user._id,
    })
      .skip(skip)
      .limit(limit);

    // Respond with expenses and total page count in JSON format
    res.json({ expenses, totalPages });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while fetching expenses for pagination.");
  }
};


// Controller function to delete an expense

const deleteExpense = async (req, res, next) => {
  let session; // Declare the session variable

  try {
    const id = req.params.id;
    console.log(id);
    session = await mongoose.startSession(); // Start a Mongoose session
    session.startTransaction(); // Start a transaction

    const expense = await Expense.findById(id);

    // Decrement totalExpenses for the user
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { totalExpenses: -expense.amount } },
      { session }
    );

    // Delete the expense
    await Expense.findByIdAndDelete(id, { session });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();

    // Redirect to the home page after deleting the expense
    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

    if (session) {
      // Abort the transaction if an error occurs
      await session.abortTransaction();
    }

    res.status(500).send("An error occurred while deleting the expense.");
  } finally {
    if (session) {
      session.endSession(); // End the session in the finally block
    }
  }
};


// Controller function to edit an expense
const editExpense = async (req, res, next) => {
  let session; // Declare the session variable

  try {
    const id = req.params.id;
    const { category, description, amount } = req.body;

    const expense = await Expense.findById(id);
    const amountDifference = amount - expense.amount;

    session = await mongoose.startSession(); // Create a new session
    session.startTransaction(); // Start a new transaction

    // Increment or decrement totalExpenses for the user based on the amount difference
    await User.updateOne(
      { _id: req.user._id },
      { $inc: { totalExpenses: amountDifference } },
      { session }
    );

    // Update the expense
    await Expense.updateOne(
      { _id: id, user: req.user._id },
      { category, description, amount },
      { session }
    );

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    // Redirect to the home page after editing the expense
    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

    if (session) {
      // Abort the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();
    }

    res.status(500).send("An error occurred while editing the expense.");
  }
};

module.exports = {
  getHomePage,
  addExpense,
  getAllExpenses,
  getAllExpensesforPagination,
  deleteExpense,
  editExpense,
};
