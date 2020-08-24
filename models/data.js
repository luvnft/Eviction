const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const data = new Schema({
    // _id: {type: String, required: true},
    // name: {type: String, required: true},
    // url: {type: String, required: true},
    // thumbUrl: {type: String, required: true},
    // attribution: {type: String, required: false}
});

const data = mongoose.model('data', data);

module.exports = data;