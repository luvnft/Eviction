const mongoose = require("mongoose");
const db = require("../models");
const evictionSeed = require('../client/src/Test-data/EvictionFilingsByTract.json');

mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://localhost/ARC-Eviction-Tracker"
);

const evictionData = evictionSeed

db.Data
  .remove({})
  .then(() => db.Data.collection.insertMany(evictionData))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
