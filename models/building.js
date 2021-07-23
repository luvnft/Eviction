const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buildingSchema = new Schema({
  _id: {type: String, required: true},
  street: {type: String, required: true},
  city: {type: String, required: true},
  zip: {type: String, required: true},
  county: {type: String, required: true},
  latitude: {type: String, required: true},
  longitude: {type: String, required: true},
  tractid: {type: String, required: true},
  blockgroupid: {type: String, required: true},
  totalfilings: {type: Number, required: true},
  pandemicfilings: {type: Number, required: true},
  pandemicratio: {type: Number, required: true},
  monthlyfilings: {type: Object || Array, required: false},
  filings: {type: Array, required: true},
});

const building = mongoose.model('building', buildingSchema);

module.exports = building;