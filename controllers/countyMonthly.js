const countyMonthly = require("../models/filingsByCountyMonth");

module.exports = {
  findAll: (req, res) => {
    console.log(req.query);
    countyMonthly
      .find(req.query)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  insertMany: (req) => {
    countyMonthly
      .insertMany(req.body)
      .then(() => {
        console.log("database succesfully updated");
        process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  },
};
