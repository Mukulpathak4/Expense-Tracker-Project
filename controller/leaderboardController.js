const path = require("path");
const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

// Controller function to render the leaderboard page
const getLeaderboardPage = (req, res, next) => {
  // Serve the HTML file for the leaderboard page
  res.sendFile(
    path.join(__dirname, "../", "public", "html", "leaderboard.html")
  );
};

// Controller function to get the leaderboard data
const getLeaderboard = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const expenses = await Expense.aggregate([
      {
        $group: {
          _id: "$userId",
          totalExpense: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalExpense: -1 },
      },
      {
        $lookup: {
          from: "users", // Assuming your User model is named "User"
=======
    // Use Mongoose to query the database and calculate the leaderboard data
    const expenses = await Expense.aggregate([
      {
        $group: {
          _id: "$user", // Group the results by the "user" field
          totalExpense: { $sum: "$amount" }, // Calculate the total expense for each user
        },
      },
      {
        $lookup: {
          from: "users", // Join with the "users" collection
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
<<<<<<< HEAD
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          amount: "$totalExpense",
        },
      },
=======
        $unwind: "$user", // Unwind the "user" array created by the $lookup stage
      },
      {
        $project: {
          _id: 0, // Exclude the "_id" field from the final result
          name: "$user.name", // Select the "name" attribute from the associated User model
          amount: "$totalExpense", // Rename the "totalExpense" field as "amount"
        },
      },
      {
        $sort: { amount: -1 }, // Order the results by total expense in descending order
      },
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
    ]);

    // Send the leaderboard data as JSON
    res.json(expenses);
  } catch (err) {
    console.error(err);
<<<<<<< HEAD
    // Handle any errors that occur during the query
    res.status(500).send("Internal Server Error");
=======
    res.status(500).send("An error occurred while fetching leaderboard data.");
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
  }
};

module.exports = {
  getLeaderboardPage,
  getLeaderboard,
};
