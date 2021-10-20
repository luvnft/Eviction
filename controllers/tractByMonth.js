const tractsByMonth = require("../models/filingsByTractMonth");

module.exports = {
  findAll: (req, res) => {
    console.log(req.query);
    tractsByMonth
      .find(req.query)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  insertMany: (req) => {
    tractsByMonth
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
