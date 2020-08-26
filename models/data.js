const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const data = new Schema({
    fileDate: {type: String, required: true},
    tractID: {type: Number, required: true},
    COUNTYFP10: {type: Number, required: true},
    totalFiling: {type: Number, required: true},
    
});

const Data = mongoose.model('data', data);

module.exports = Data;