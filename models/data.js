const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evicDataSchema = new Schema({
    "File.Date": {type: String, required: true},
    tractID: {type: Number, required: true},
    COUNTYFP10: {type: Number, required: true},
    Count: {type: Number, required: true},
    
});

const evicData = mongoose.model('evicdata', evicDataSchema);

module.exports = evicData;