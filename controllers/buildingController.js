const content = require('../models/building')

// Defining methods
module.exports = {
  findAll: (req, res) => {
    // console.log(req.query);
    content.find()
      .sort('totalfilings')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
}