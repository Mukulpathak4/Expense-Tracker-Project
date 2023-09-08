// Import the Express framework for building web applications.
const express = require("express");
const app = express();

// Import the body-parser middleware for parsing HTTP request bodies.
const bodyParser = require("body-parser");

// Import the Sequelize instance for connecting to the database.
const sequelize = require("./util/database");

// Import the route handlers for different parts of your application.
const userRouter = require("./routes/userRoutes"); // User-related routes
const expenseRouter = require("./routes/expenseRouter"); // Expense-related routes
const purchaseMembershipRouter = require("./routes/purchaseMembershipRouter"); // Purchase membership related routes

// Import the Sequelize models that define your database tables.
const User = require("./models/userModel"); // User model
const Expense = require("./models/expenseModel"); // Expense model
const Order = require("./models/orderModel"); // Order model

// Serve static files from the "public" directory.
app.use(express.static("public"));

// Use body-parser middleware to parse incoming JSON and form data.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes for different parts of your application and connect them to route handlers.

// Routes related to user management:
app.use("/", userRouter); // These routes will be accessible at the root URL and "/user".

// Routes related to the expense tracker application:
app.use("/homePage", expenseRouter); // These routes will be accessible under "/homePage" for managing expenses.
app.use("/expense", expenseRouter); // These routes will also be accessible under "/expense".

// Routes related to purchasing membership:
app.use("/purchase", purchaseMembershipRouter); // These routes will be accessible under "/purchase".

// Define relationships between database tables using Sequelize associations.
User.hasMany(Expense); // A user can have multiple expenses.
Expense.belongsTo(User); // An expense belongs to a user.

User.hasMany(Order); // A user can have multiple orders (e.g., for premium membership).
Order.belongsTo(User); // An order belongs to a user.

// Sync the Sequelize models with the database and start the Express application.
sequelize
  .sync() // This method synchronizes the database schema with the defined models.
  .then((result) => {
    app.listen(3000); // Start the Express app on port 3000.
  })
  .catch((err) => console.log(err)); // Handle any errors that occur during synchronization.
