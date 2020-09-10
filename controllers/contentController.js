const content = require('../models/content')

// Defining methods
module.exports = {
    findAll: (req, res) => {
      console.log(req.query);
      content.find(req.query)
        // .sort({ date: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
  
    
    create: (req, res) => {
      console.log(req.body)
      content.create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: (req, res) => {
      const { _id } = req.body;
      
      content.findByIdAndUpdate(_id, req.body)
        .then(dbModel => 
          {console.log("Update Content",req.body)
          res.json(dbModel)})
        .catch(err => res.status(422).json(err));
    },
}; 