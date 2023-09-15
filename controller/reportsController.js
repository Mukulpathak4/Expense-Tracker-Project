const path = require("path");
const Expense = require("../models/expenseModel");
const { Op } = require("sequelize");

// Controller function to render the reports page
const getReportsPage = (req, res, next) => {
  // Serve the HTML file for the reports page
  res.sendFile(path.join(__dirname, "../", "public", "html", "report.html"));
};

// Controller function to get daily expense reports
const dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date; // Extract the requested date from the request body

    // Find all expenses for the specified date and the current user
    const expenses = await Expense.findAll({
      where: { date: date, userId: req.user.id },
    });

    // Send the list of expenses as the response
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

// Controller function to get monthly expense reports
const monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month; // Extract the requested month from the request body

    // Find all expenses for the specified month and the current user
    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.like]: `%-${month}-%`, // Use Sequelize's Op.like to match the month in the date
        },
        userId: req.user.id,
      },
      raw: true, // Return raw data instead of Sequelize instances
    });

    // Send the list of expenses as the response
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getReportsPage,
  dailyReports,
  monthlyReports
};