const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require('mongoose');
require('dotenv').config();

const bodyParser = require("body-parser");

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/orderModel");
const ResetPassword = require("./models/resetPasswordModel");

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

// Serve your HTML file for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "user.html"));
});

const PORT = process.env.PORT || 3200;

mongoose.connect('mongodb+srv://mkp123:GateAIR2987@cluster0.smlxq3a.mongodb.net/')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
