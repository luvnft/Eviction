const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filingsByCountyWeekSchema = new Schema({
  Key: { type: String, required: true },
  FilingWeek: { type: String, required: true },
  CountyID: { type: String, required: true },
  TotalFilings: { type: Number, required: true },
  AnsweredFilings: { type: Number, required: true },
});

const filingsByCountyWeek = mongoose.model(
  "filingsByCountyWeek",
  filingsByCountyWeekSchema
);

module.exports = filingsByCountyWeek;
