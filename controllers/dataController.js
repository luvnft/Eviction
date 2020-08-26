const Data = require('../models/data')

// Defining methods
module.exports = {
    findAll: function(req, res) {
      Data.find(req.query)
        // .sort({ date: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
  
    
    create: function(req, res) {
      console.log(req.body)
      Data.create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: function(req, res) {
      const { _id } = req.body;
      
      Data.findByIdAndUpdate(_id, req.body)
        .then(dbModel => 
          {console.log("Update Data",req.body)
          res.json(dbModel)})
        .catch(err => res.status(422).json(err));
    },
}; 