// const mongoose = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApiKeySchema = new Schema({
	// Generated automatically when request is made
	apiKey: { type: String, required: true, unique: true },
	admin: { type: Boolean, required: true },
	global: { type: Boolean, required: true },

	// Controller can handle the following fields inside of the permissions object:
	// counties- array of county codes as strings, limit- number that reps # of docs returned
	// Default- {counties: ['063', '067', '089', '121', '135']} - no limit
	permissions: { type: Object, required: false },
	createdOn: { type: Date, default: new Date() }
});

const ApiKey = mongoose.model('apiKey', ApiKeySchema);

module.exports = ApiKey;
