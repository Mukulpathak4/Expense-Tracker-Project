const path = require("path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
<<<<<<< HEAD
const mongoose = require('mongoose');
=======
const mongoose = require("../util/database");
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b

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
<<<<<<< HEAD
  
    // });
console.log(req.user);
    // Save the expense to the database
    await Expense.create({
=======
    const expense = new Expense({
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
      date: date,
      category: category,
      description: description,
      amount: amount,
<<<<<<< HEAD
      userId: req.user._id,
    });

=======
      userId: req.user.id,
    });

    // Save the expense to the database
    await expense.save();

>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
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
<<<<<<< HEAD
    const expenses = await Expense.find({ userId: req.user.id });
    
=======
    const expenses = await Expense.find({ user: req.user._id });

>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
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
<<<<<<< HEAD
    const totalExpenses = await Expense.countDocuments({ userId: req.user.id });
=======
    const totalExpenses = await Expense.countDocuments({
      user: req.user._id,
    });
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b

    // Calculate the total number of pages needed for pagination
    const totalPages = Math.ceil(totalExpenses / limit);

    // Fetch expenses for the current page
    const expenses = await Expense.find({
<<<<<<< HEAD
      userId: req.user.id,
    })
      .skip(offset)
=======
      user: req.user._id,
    })
      .skip(skip)
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
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
<<<<<<< HEAD
  console.log(req.params); // Log the params object
  console.log(req.url); // Log the entire request URL
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = req.params.id; // Ensure this line is correctly accessing the ID from params
    const expense = await Expense.findById(id);

    // If the expense is not found, handle the case accordingly
    if (!expense) {
      res.status(404).send("Expense not found.");
      return;
    }
=======
  let session; // Declare the session variable

  try {
    const id = req.params.id;
    console.log(id);
    session = await mongoose.startSession(); // Start a Mongoose session
    session.startTransaction(); // Start a transaction

    const expense = await Expense.findById(id);
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b

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

<<<<<<< HEAD
    // Rollback the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();
=======
    if (session) {
      // Abort the transaction if an error occurs
      await session.abortTransaction();
    }
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b

    res.status(500).send("An error occurred while deleting the expense.");
  } finally {
    if (session) {
      session.endSession(); // End the session in the finally block
    }
  }
};


// Controller function to edit an expense
const editExpense = async (req, res, next) => {
<<<<<<< HEAD
  const session = await mongoose.startSession();
  session.startTransaction();
=======
  let session; // Declare the session variable
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b

  try {
    const id = req.params.id;
    const { category, description, amount } = req.body;

    const expense = await Expense.findById(id);
<<<<<<< HEAD

    // If the expense is not found, handle the case accordingly
    if (!expense) {
      res.status(404).send("Expense not found.");
      return;
    }

    const amountDifference = amount - expense.amount;

    // Increment or decrement totalExpenses for the user based on the amount difference
    await User.findByIdAndUpdate(
      req.user.id,
=======
    const amountDifference = amount - expense.amount;

    session = await mongoose.startSession(); // Create a new session
    session.startTransaction(); // Start a new transaction

    // Increment or decrement totalExpenses for the user based on the amount difference
    await User.updateOne(
      { _id: req.user._id },
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
      { $inc: { totalExpenses: amountDifference } },
      { session }
    );

    // Update the expense
<<<<<<< HEAD
    await Expense.findByIdAndUpdate(
      id,
      {
        category: category,
        description: description,
        amount: amount,
      },
=======
    await Expense.updateOne(
      { _id: id, user: req.user._id },
      { category, description, amount },
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
      { session }
    );

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
<<<<<<< HEAD
=======
    session.endSession();
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b

    // Redirect to the home page after editing the expense
    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

<<<<<<< HEAD
    // Rollback the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();
=======
    if (session) {
      // Abort the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();
    }
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b

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
