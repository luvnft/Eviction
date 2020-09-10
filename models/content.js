const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    mission : {type: Array, required: true},
    aboutdata : {type: Array, required: true},
    sources : {type: Array, required: true},
    resources : {type: Array, required: true},
    team : {type: Array, required: true}
});

const content = mongoose.model('content', contentSchema);

module.exports = content;