const getCSV = require('get-csv');
const moment = require('moment');
const cron = require('node-cron');
// const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/eviction-tracker';
const DBNAME = process.env.MONGODB_NAME || 'eviction-tracker';



const insertDocuments = (db, json, collectionName, callback) => {
    db.collection(collectionName) ? db.collection(collectionName).drop() : console.log('No collection dropped')
    const collection = db.collection(collectionName);

    collection.insertMany(json, (err, result) => {
      err ? console.log(err) : console.log(`${collectionName} update successful at ${moment().format('M/D/YY h:mm a')}`);
      callback(result);
    });
  }


const updateData = (csvPath, collectionName) =>
        getCSV(csvPath).then(json =>
            MongoClient.connect(MONGODB_URI, (err, client) => {
                assert.equal(null, err);
                // console.log("Connected successfully to server");
                const db = client.db(DBNAME);
            
                insertDocuments(db, json, collectionName, () =>
                client.close());
            })
        );

console.log(`Updater started at ${moment().format('M/D/YYYY h:mm a')}`)

updateData(
    //Direct to seedData/AllCounties...,
    //Name of collection
);






// var startDate = new Date('01-22-2020'); //YYYY-MM-DD
// var endDate = new Date('03-27-2020'); //YYYY-MM-DD

// var getDateArray = function(start, end) {
//     var arr = [];
//     var dt = new Date(start);
//     while (dt <= end) {
//         arr.push(moment(new Date(dt)).format('MM-DD-YYYY'));
//         dt.setDate(dt.getDate() + 1);
//     }
//     return arr;
// }

// var dateArr = getDateArray(startDate, endDate);

// console.log(dateArr);


// dateArr.map(date => getCSV(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date}.csv`)
//   .then(json => 
//     fs.writeFile(
//       `./src/jh-daily-reports/${date}.json`, 
//       JSON.stringify(json), 
//       'utf8', 
//       () => console.log(`${json.length} records in ${date}`)
//     )
//   )
// );
