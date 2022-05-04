const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CasesSchema = new Schema({
	caseID: { type: String },
	county: { type: String },
	fileDate: { type: String },
	fileDateISO: { type: Date },
	caseStatus: { type: String },
	events: [{ type: Object }],
	plaintiffName: { type: String },
	plaintiffStreetAddress: { type: String },
	plaintiffCity: { type: String },
	plaintiffPhone: { type: String },
	plaintiffAttorney: { type: String },
	defendantName1: { type: String },
	defendantName2: { type: String },
	attorney: { type: String },
	street: { type: String }, //cast from streetAddress if not in data
	city: { type: String }, // remove commas and / ga/i and numbers
	zip: { type: String },
	address: { type: String }, // concat `street, city, GA zip`
	answer: { type: String },
	services: { type: String },
	dismiss: { type: String },
	defaultJudgment: { type: String },
	judgment: { type: String },
	answerDate: { type: String },
	answerDateISO: { type: Date },
	servicesDate: { type: String },
	servicesDateISO: { type: Date },
	dismissDate: { type: String },
	dismissDateISO: { type: Date },
	defaultJudgmentDate: { type: String },
	defaultJudgmentDateISO: { type: Date },
	judgmentDate: { type: String },
	judgmentDateISO: { type: Date },
	judgmentType: { type: String },
	judgmentFor: { type: String },
	judgmentComp: { type: String },
	tractID: { type: String },
	blockGroupID: { type: String },
	latitude: { type: Number },
	longitude: { type: Number },
	geometry: { type: Object },
	id: { type: String }, // legacy property
	addedOn: { type: Date },
	updatedOn: { type: Date, default: Date.now() }
});

const Case = mongoose.model('case', CasesSchema);

module.exports = Case;
