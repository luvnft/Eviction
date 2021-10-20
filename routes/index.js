const path = require("path");
const router = require("express").Router();
const evictionDataRoutes = require("./evictionsbytract");
const contentRoutes = require("./content");
const buildingRoutes = require("./buildings");
const countyWeeklyRoutes = require("./countyWeekly");
const countyMonthlyRoutes = require("./countyMonthly");
const tractByMonthRoutes = require("./tractByMonth");

router.use("/evictionsbytract", evictionDataRoutes);
router.use("/content", contentRoutes);
router.use("/buildings", buildingRoutes);
router.use("/countymonthly", countyMonthlyRoutes);
router.use("/countyweekly", countyWeeklyRoutes);
router.use("/tractbymonth", tractByMonthRoutes);

// If no API routes are hit, send the React app
router.use((req, res) =>
  res.sendFile(path.join(__dirname, "../client/build/index.html"))
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
