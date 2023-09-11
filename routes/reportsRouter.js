const express = require("express");
const router = express.Router();
const reportsController = require("../controller/reportsController");
const userAuthentication = require("../authentication/auth");

router.post(
  "/dailyReports",
  userAuthentication,
  reportsController.dailyReports
);
router.post(
  "/monthlyReports",
  userAuthentication,
  reportsController.monthlyReports
);

router.get("/getReportsPage", reportsController.getReportsPage);
module.exports = router;