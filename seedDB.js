require('dotenv').config();
const mongoose = require("mongoose");
const http = require('http');
const fs = require('fs');
const db = require("./models");
const MONGODB_URI = process.env.MONGODB_URI;
const evictionsByTractSeed = require('./Data/EvictionFilingsByTract.json');
const evictionsByTract = evictionsByTractSeed;
const contentSeed = require('./Data/content.json');
const content = contentSeed;
const moment = require('moment');

const config = {
  getFultonData : false,
  getGATechData : false,
  seeDB : {
    content: false,
    data: true
  }
};

const gatechAPIOptions = {
  1 : {
    host: 'evictions.design.gatech.edu',
    path: '/rest/atlanta_metro_area_tracts?select=id,filedate,tractid,countyfp10,totalfilings,totalansweredfilings'
  },
  2 : {
    host: 'evictions.design.gatech.edu',
    path: '/rest/fulton_county_cases'
  }
};

const callbacks = {
  
  1 : response => {
    var str = '';
    response.on('data', chunk => {
      str += chunk
    });
    response.on('end', () => {
      // console.log(str);
      const data = JSON.parse(str).map(record => ({
        "Filing Date": moment(new Date(record.filedate)).format('M/D/YY'),
        "tractID": parseInt(record.tractid),
        "COUNTYFP10": parseInt(record.countyfp10),
        "Total Filings": parseInt(record.totalfilings)    
      }));
      // console.log(data);
      fs.writeFile(
        './data/GATechEvictionFilingsByTract.json', 
        JSON.stringify(data),
        err => console.log(err))
      console.log('Done with GA Tech Data!')
    });
  },
  2 : response => {
    var str = '';
    response.on('data', chunk => {
      str += chunk
    });
    response.on('end', () => {
      fs.writeFile(
        './data/GATechEvictionFilingEventsFulton.json', 
        str,
        err => console.log(err)
      )
      console.log('Done with Fulton County Data!')
    });
  }
}

config.getGATechData 
  ? http.request(
      gatechAPIOptions[1], 
      callbacks[1]
    ).end() 
  : null;

config.getFultonData 
  ? http.request(
      gatechAPIOptions[2],
      callbacks[2]
    ).end()
  : null;

config.seeDB.content ||
config.seeDB.data 
  ? mongoose.connect(MONGODB_URI,
      { useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
  : null; 

config.seeDB.data
  ? db.evictionsbytract
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
      })
  : null;

config.seeDB.content
  ? db.content
    .remove()
    .then(() => 
      db.content
      .insertMany(content))
      .then(data => {
          console.log(data.length + " records inserted!");
          process.exit(0);
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      }
    )
  : null;