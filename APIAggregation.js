require("dotenv").config();
const mongoose = require("mongoose");
const db = require("./models");
const MONGODB_URI = process.env.MONGODB_URI;
const moment = require("moment");
const axios = require("axios");
const SOCRATA_API_SECRET = process.env.SOCRATA_API_SECRET;
const SOCRATA_API_KEY = process.env.SOCRATA_API_KEY;
const TOKEN = process.env.TOKEN;

let gaTechData = [];
let fultonData = [];
let stitchedData = [];

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Connection ERROR: ", err);
  });

const sortByDate = (dateField) => {
  return (a, b) => {
    var dateA = new Date(a[dateField]).getTime();
    var dateB = new Date(b[dateField]).getTime();
    return dateA > dateB ? -1 : 1;
  };
};

const fetchData = async () => {
  await axios
    .get(
      "https://sharefulton.fultoncountyga.gov/resource/qh59-mhjw.json?$limit=50000",
      {
        auth: { username: SOCRATA_API_KEY, password: SOCRATA_API_SECRET },
      }
    )
    .then((array) => {
      const formattedArray = array.data.map((obj) => {
        return {
          filedate: moment(obj.filedate).format("L"),
          tractID: obj.tractid,
          countyID: obj.countyfp10,
          totalFilings: Number(obj.totalfilings),
        };
      });
      let dateSortedArray = formattedArray.sort(sortByDate("filedate"));
      fultonData = dateSortedArray.filter((item) => {
        return (
          item.countyID === "063" ||
          item.countyID === "067" ||
          item.countyID === "089" ||
          item.countyID === "121" ||
          item.countyID === "135"
        );
      });
    })
    .catch((err) => console.log("Error Fetching Data: ", err.message));
  await axios
    .get(
      "https://evictions.design.gatech.edu/rest/atlanta_metro_area_tracts?select=id,filedate,tractid,countyfp10,totalfilings,totalansweredfilings"
    )
    .then((array) => {
      const formattedArray = array.data.map((obj) => {
        return {
          tractID: Number(obj.tractid),
          filedate: obj.filedate,
          countyID: obj.countyfp10,
          totalFilings: Number(obj.totalfilings),
          answeredFilings: Number(obj.totalansweredfilings),
        };
      });
      let dateSortedArray = formattedArray.sort(sortByDate("filedate"));
      gaTechData = dateSortedArray.filter((item) => {
        return (
          item.countyID === "063" ||
          item.countyID === "067" ||
          item.countyID === "089" ||
          item.countyID === "121" ||
          item.countyID === "135"
        );
      });
    })
    .catch((err) => console.log("Error Fetching Data: ", err.message));

  /// stitching most recent fulton data into tech data

  const referenceDate = new Date(gaTechData[0].filedate);
  let lastFultonDate;
  let i = 0;
  stitchedData = gaTechData;
  while (referenceDate < lastFultonDate) {
    stitchedData.push(fultonData[i]);
    lastFultonDate = new Date(fultonData[i].filedate);
    i++;
  }
};

const aggregateTractMonth = () => {
  const aggObj = {};
  const finalArray = [];
  fultonData.forEach((item) => {
    const dtObj = new Date(item.filedate);
    const dateKey = dtObj.getMonth() + "-" + dtObj.getFullYear();
    const key = dateKey + "-" + item.tractID;
    if (aggObj[key] === undefined) {
      aggObj[key] = item;
    } else {
      aggObj[key].totalFilings += item.totalFilings;
    }
  });
  for (const [key, value] of Object.entries(aggObj)) {
    finalArray.push({
      Key: key,
      FilingMonth: value.filedate,
      TractID: value.tractID,
      CountyID: value.countyID,
      TotalFilings: value.totalFilings,
    });
  }
  return finalArray;
};

const aggregateCountyMonthly = () => {
  const aggObj = {};
  const finalArray = [];
  stitchedData.forEach((item) => {
    const dtObj = new Date(item.filedate);
    const dateKey = dtObj.getMonth() + "-" + dtObj.getFullYear();
    const key = dateKey + "-" + item.countyID;
    if (aggObj[key] === undefined) {
      aggObj[key] = item;
    } else {
      aggObj[key].totalFilings += item.totalFilings;
    }
  });
  for (const [key, value] of Object.entries(aggObj)) {
    finalArray.push({
      Key: key,
      FilingMonth: value.filedate,
      CountyID: value.countyID,
      TotalFilings: value.totalFilings,
      AnsweredFilings: value.answeredFilings,
    });
  }
  return finalArray;
};

const aggregateCountyWeekly = () => {
  const aggObj = {};
  const finalArray = [];
  stitchedData.forEach((item) => {
    const dtObj = new Date(item.filedate);
    const firstOfWeek = moment(dtObj).startOf("week").format("L");
    const endOfWeek = moment(dtObj).endOf("week").format("L");
    const dateKey = firstOfWeek + "-" + endOfWeek;
    const key = dateKey + "-" + item.countyID;
    if (aggObj[key] === undefined) {
      aggObj[key] = item;
    } else {
      aggObj[key].totalFilings += item.totalFilings;
      aggObj[key].answeredFilings += item.answeredFilings;
    }
  });
  for (const [key, value] of Object.entries(aggObj)) {
    finalArray.push({
      Key: key,
      FilingWeek: value.filedate,
      CountyID: value.countyID,
      TotalFilings: value.totalFilings,
      AnsweredFilings: value.answeredFilings,
    });
  }
  return finalArray;
};

fetchData().then(() => {
  // console.log(aggregateTractMonth());
  // console.log(aggregateCountyMonthly());
  // console.log(aggregateCountyWeekly());
  // db.tractMonth.insertMany(aggregateTractMonth());
  // db.countyMonth.insertMany(aggregateCountyMonthly());
  db.countyWeek.insertMany(aggregateCountyWeekly());
});
