const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evictionsByTractSchema = new Schema({
    "Filing Date": {type: String, required: true},
    tractID: {type: Number, required: true},
    COUNTYFP10: {type: Number, required: true},
    "Total Filings": {type: Number, required: true},
    
});

const evictionsByTract = mongoose.model('evictionsbytract', evictionsByTractSchema);

module.exports = evictionsByTract;