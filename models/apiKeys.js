// const mongoose = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApiKeySchema = new Schema({
	apiKey: { type: String, required: true, unique: true },
	admin: { type: Boolean, required: true },
	global: { type: Boolean, required: true },
	permissions: {
		allCounties: { type: Boolean },
		counties: { type: Array },
		// allCities: { type: Boolean },
		// cities: { type: Array },
		limit: { type: Number }
	}
});

const ApiKey = mongoose.model('apiKey', ApiKeySchema);

module.exports = ApiKey;
