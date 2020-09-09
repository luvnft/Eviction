require('dotenv').config();
const mongoose = require("mongoose");
const db = require("./models");
const evictionsByTractSeed = require('./seed/Data/EvictionFilingsByTract.json');
const MONGODB_URI = process.env.MONGODB_URI;
const evictionsByTract = evictionsByTractSeed;

mongoose.connect(MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true
  }
); 

db.evictionsbytract
  .remove()
  .then(() => 
  db.evictionsbytract.insertMany(evictionsByTract))
    .then(data => {
      console.log(data.length + " records inserted!");
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });