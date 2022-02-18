const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filingsByTractDailySchema = new Schema({
	FilingDate: { type: String, required: true },
	TractID: { type: Number, required: true },
	CountyID: { type: Number, required: true },
	TotalFilings: { type: Number, required: true },
	TotalAnsweredFilings: { type: Number, required: true }
	// UniqueIdentifier: { type: String, required: true }
});

const filingsByTractDaily = mongoose.model(
	'filingsbytractdaily',
	filingsByTractDailySchema
);

module.exports = filingsByTractDaily;
