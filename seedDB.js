require('dotenv').config();
const mongoose = require("mongoose");
const db = require("./models");
const MONGODB_URI = process.env.MONGODB_URI;
const evictionsByTractSeed = require('./seed/Data/EvictionFilingsByTract.json');
const evictionsByTract = evictionsByTractSeed;
const contentSeed = require('./seed/Data/content.json');
const content = contentSeed;


mongoose.connect(MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true
  }
); 

db.content
  .remove()
  .then(() => 
  db.content.insertMany(content))
    .then(data => {
      console.log(data.length + " records inserted!");
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });

// db.evictionsbytract
//   .remove()
//   .then(() => 
//   db.evictionsbytract.insertMany(evictionsByTract))
//     .then(data => {
//       console.log(data.length + " records inserted!");
//       process.exit(0);
//     })
//     .catch(err => {
//       console.error(err);
//       process.exit(1);
//     });