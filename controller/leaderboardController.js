const path = require("path");
const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const sequelize = require("../util/database");

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
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
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
    ]);

    // Send the leaderboard data as JSON
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching leaderboard data.");
  }
};

module.exports = {
  getLeaderboardPage,
  getLeaderboard
};