const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CasesSchema = new Schema({
	id: { type: String },
	streetAddress: { type: String },
	city: { type: String },
	zip: { type: String },
	fileDate: { type: String },
	answer: { type: String },
	county: { type: String },
	latitude: { type: Number },
	longitude: { type: Number },
	geometry: { type: Object },
	services: { type: String },
	dismiss: { type: String },
	defaultJudgment: { type: String },
	judgment: { type: String },
	answerDate: { type: String },
	servicesDate: { type: String },
	dismissDate: { type: String },
	defaultJudgmentDate: { type: String },
	judgmentDate: { type: String },
	tractID: { type: String },
	blockGroupID: { type: String },
	caseID: { type: String },
	events: [{ type: Array }],
	caseStatus: { type: String },
	plaintiff: { type: Object },
	defendantName1: { type: String },
	defendantName2: { type: String },
	attorney: { type: String },
	judgmentType: { type: String },
	judgmentFor: { type: String },
	judgmentComp: { type: String },
	address: { type: String }
});

const Case = mongoose.model('case', CasesSchema);

module.exports = Case;
