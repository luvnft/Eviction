const path = require("path");
const router = require("express").Router();

const contentRoutes = require("./content");
const buildingRoutes = require("./buildings");
const countyWeeklyRoutes = require("./countyWeekly");
const countyMonthlyRoutes = require("./countyMonthly");
const tractByMonthRoutes = require("./tractByMonth");
const tractDailyRoutes = require("./tractDaily");
const casesRoutes = require("./cases");
const apiKeyRoutes = require("./apiKeys");

router.use("/content", contentRoutes);

router.use("/rest/buildings", buildingRoutes);
router.use("/rest/countymonthly", countyMonthlyRoutes);
router.use("/rest/countyweekly", countyWeeklyRoutes);
router.use("/rest/tractbymonth", tractByMonthRoutes);
router.use("/rest/tractdaily", tractDailyRoutes);

// Protected Routes
router.use("/rest/cases", casesRoutes);
router.use("/rest/apikeys", apiKeyRoutes);

// If no API routes are hit, send the React app
router.use((req, res) =>
  res.sendFile(path.join(__dirname, "/client/dist/index.html"))
);

router.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let msg = err.message;
  // If we are in production, override the message we
  // expose to the client (for security reasons)
  if (process.env.NODE_ENV === "production") {
    msg = "Internal server error";
  }
  if (err.statusCode === 500) {
    console.error(err);
  }
  res.status(err.statusCode).json({
    error: msg,
  });
});

module.exports = router;
