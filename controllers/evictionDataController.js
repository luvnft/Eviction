const evictionsByTract = require("../models/evictionsbytract");

// Defining methods
module.exports = {
  findAll: (req, res) => {
    console.log(req.query);
    evictionsByTract
      .find(req.query)
      // .sort({ date: -1 })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  create: (req, res) => {
    console.log(req.body);
    evictionsByTract
      .create(req.body)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  update: (req, res) => {
    const { _id } = req.body;

    evictionsByTract
      .findByIdAndUpdate(_id, req.body)
      .then((dbModel) => {
        console.log("Update Evictions by Tract", req.body);
        res.json(dbModel);
      })
      .catch((err) => res.status(422).json(err));
  },
};
