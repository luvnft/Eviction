// const mongoose = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApiKeySchema = new Schema(
	{
		// Generated automatically when request is made
		apiKey: { type: String, required: true, unique: true },
		admin: { type: Boolean, required: true },
		global: { type: Boolean, required: true },
		permissions: {
			query: { type: Object, default: {} },
			deselectedFields: { type: Array, default: [] }
		},
		history: { type: Object, default: {} },
		createdOn: { type: Date, default: new Date() }
	},
	{ minimize: false } // allows an empty obj to be entered into a doc
);

const ApiKey = mongoose.model('apiKey', ApiKeySchema);

module.exports = ApiKey;
