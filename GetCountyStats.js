require('dotenv').config();
const moment = require('moment');
// const db = require('./models');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
const axios = require('axios');
const TOKEN = process.env.TOKEN;
const { parse } = require('json2csv');
const fs = require('fs');
const url = 'http://evictions.design.gatech.edu/rest/atlanta_metro_area_cases';



mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const filterRecords = record => record['county'] === '063' &&
 new Date(record['filingdate']) >= new Date('04/01/2020')


const getData = async () => {
  const dataArray = [];
	const filings = await axios
		.get(url, {
			headers: { Authorization: `Bearer ${TOKEN}` }
		})
		.then(res => res.data)
		.catch(err => console.log('Error Fetching Data: ', err.message));

	if (filings) {
		await filings
      .filter(record => filterRecords(record))  
      .forEach(record => dataArray.push(record))
  }
  return dataArray;
};

getData()
  .then(data => {
    // console.log(data);
    const csv = parse(data);

    fs.writeFile('./data/data.csv', csv, err => err
      ? console.log(err)
      : (console.log('sucess'), process.exit(0))
    )
  })
  .catch(err => console.log('Error Handling Data: ', err.message));


