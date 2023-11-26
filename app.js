const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require('mongoose');
require('dotenv').config();

const bodyParser = require("body-parser");

app.use( helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

<<<<<<< HEAD
// Import the Sequelize instance for connecting to the database.
const mongoose = require("./util/database");

// Import the route handlers for different parts of your application.
const userRouter = require("./routes/userRoutes"); // User-related routes
const expenseRouter = require("./routes/expenseRouter"); // Expense-related routes
const purchaseMembershipRouter = require("./routes/purchaseMembershipRouter"); // Purchase membership related routes
const leaderboardRouter = require("./routes/leaderboardRouter");
const reportsRouter = require("./routes/reportsRouter");

const resetPasswordRouter = require("./routes/resetPassword");


const serverKey = fs.readFileSync('server.key');
const serverCert = fs.readFileSync('server.cert');

// Serve static files from the "public" directory.
=======
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/orderModel");
const ResetPassword = require("./models/resetPasswordModel");

>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRouter");
const purchaseMembershipRouter = require("./routes/purchaseMembershipRouter");
const leaderboardRouter = require("./routes/leaderboardRouter");
const reportsRouter = require("./routes/reportsRouter");
const resetPasswordRouter = require("./routes/resetPassword");

app.use("/", userRouter);

app.use("/homePage", expenseRouter);
app.use("/expense", expenseRouter);

app.use("/purchase", purchaseMembershipRouter);

app.use("/premium", leaderboardRouter);

app.use("/reports", reportsRouter);

app.use("/password", resetPasswordRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

<<<<<<< HEAD
const PORT = process.env.PORT || 3200;

mongoose.connect('process.env.MONGOURI')
=======
// Serve your HTML file for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "user.html"));
});

const PORT = process.env.PORT || 3200;

mongoose.connect('')
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
<<<<<<< HEAD
  });
=======
  });
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
