const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CasesSchema = new Schema({
	id: { type: String },
	streetAddress: { type: String },
	city: { type: String },
	zip: { type: String },
	fileDate: { type: String },
	fileDateISO: { type: Date },
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
	answerDateISO: { type: Date },
	servicesDate: { type: String },
	servicesDateISO: { type: Date },
	dismissDate: { type: String },
	dismissDateISO: { type: Date },
	defaultJudgmentDate: { type: String },
	defaultJudgmentDateISO: { type: Date },
	judgmentDate: { type: String },
	judgmentDateISO: { type: Date },
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
	address: { type: String },
	updatedOn: { type: Date, default: Date.now() }
});

const Case = mongoose.model('case', CasesSchema);

module.exports = Case;
