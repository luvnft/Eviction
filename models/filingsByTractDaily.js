const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filingsByTractDailySchema = new Schema(
	{
		FilingDate: { type: String, required: true },
		TractID: { type: String, required: true },
		CountyID: { type: String, required: true },
		TotalFilings: { type: Number, required: true },
		TotalAnsweredFilings: { type: Number, required: true }
		// UniqueIdentifier: { type: String, required: true }
	},
	{ collection: 'filingsbytractdaily' } // Collection was created without mongoose initially, this helps specify the collection since it is not plural
);

const filingsByTractDaily = mongoose.model(
	'filingsbytractdaily',
	filingsByTractDailySchema
);

module.exports = filingsByTractDaily;
