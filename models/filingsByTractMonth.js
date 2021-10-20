const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filingsByTractMonthSchema = new Schema({
  Key: { type: String, required: true },
  FilingMonth: { type: String, required: true },
  TractID: { type: String, required: true },
  CountyID: { type: String, required: true },
  TotalFilings: { type: Number, required: true },
});

const filingsByTractMonth = mongoose.model(
  "filingsByTractMonth",
  filingsByTractMonthSchema
);

module.exports = filingsByTractMonth;
