require('dotenv').config();
const http = require('http');
const cron = require('node-cron');
const moment = require('moment');
const db = require('./models');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

const array = [];

mongoose.connect(MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

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

const insertInDB = evictionsByTract =>
  db.evictionsbytract
  .remove()
  .then(() => 
    db.evictionsbytract.insertMany(evictionsByTract))
    .then(data => {
      console.log(data.length,
        'records inserted on',
        moment().format('MMMM Do YYYY [at] h:mm:ss a')
      );
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    })

const aggregateFilings = res => {
  const object = {};
  let str = '';
  res.on('data', chunk => {
    str += chunk
  }); 
  res.on('end', () => {
    JSON.parse(str).filter(item => 
      new Date(item.filedate).getTime() > 
      new Date('9/18/2020').getTime()
    )
    .forEach(item => 
      object[item.filedate]
        ? object[item.filedate] = {
          ...object[item.filedate],
          'Total Filings' : object[item.filedate]['Total Filings'] + 1
        }
        : object[item.filedate] = {
          'Filing Date' : item.filedate,
          'tractID' : 9999999,
          'COUNTYFP10' : 121,
          'Total Filings' : 1
        })
    Object.values(object).forEach(item => 
      array.push(item)
    );
    // fs.writeFile(
    //   './data/GATechEvictionFilingsByTractAUTOTEST.json', 
    //   JSON.stringify(array),
    //   err => console.log(err))
    insertInDB(array);

  });
};

const mapToArray = res => {
  let str = '';
  res.on('data', chunk => {
    str += chunk
  }); 
  res.on('end', () => {
    JSON.parse(str).filter(item => 
      new Date(item.filedate).getTime() >= 
      new Date('1/1/2020').getTime()
    )
    .forEach(item => array.push({
        'Filing Date': item.filedate,
        'tractID': parseInt(item.tractid),
        'COUNTYFP10': parseInt(item.countyfp10),
        'Total Filings': parseInt(item.totalfilings)    
    })
  )
  http.request(
      gatechAPIOptions[2],
      aggregateFilings
    ).end()
  })
}

const getEvictionData = () => {
  http.request(
    gatechAPIOptions[1],
    mapToArray
  ).end();
};

console.log('Eviction Tracker API to API started on', 
  moment().format('MMMM Do YYYY [at] h:mm:ss a')
);

// cron.schedule('00 05 01 * * 1', () =>
  getEvictionData()
// );
