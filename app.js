const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");

const cors = require("cors");
app.use(cors());


const sequelize = require("./util/database");
const userRouter = require("./routes/userRoutes");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/user", userRouter);



sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));