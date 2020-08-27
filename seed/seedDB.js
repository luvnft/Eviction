require("dotenv").config();
const mongoose = require("mongoose");
const db = require("../models");
const evictionSeed = require('../client/src/Test-data/EvictionFilingsByTract.json');
const dbURI =  process.env.MONGODB_URI ||
"mongodb://localhost"

mongoose.connect(`${dbURI}/atlevtrakr${process.env.MONGODB_URI ?   
  "?retryWrites=true&w=majority": ""
  }`);

const evictionData = evictionSeed

// db.evictiondata
  // .remove()
  // .then(() => 
  db.evictiondata.insertMany(evictionData)
  .then(data => {
    console.log("records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
