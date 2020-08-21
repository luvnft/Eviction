
require('dot-env');
const express = require('express');
// const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3008;
const MongoClient = require('mongodb').MongoClient;

// app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/eviction-tracker';
const DBNAME = process.env.MONGODB_NAME || 'eviction-tracker';

let db;

// let usCases, globalCases, usDeaths, globalDeaths;


MongoClient.connect(MONGODB_URI, (err, client) => {
    if (err) return console.log(err)
    db = client.db(DBNAME)
    
    app.listen(PORT,  () =>
        console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`)
    );

    app.get('/tracts', (req, res) => {
      db.collection('tracts').find({}).toArray((err,data) => res.send(data));
    });


});