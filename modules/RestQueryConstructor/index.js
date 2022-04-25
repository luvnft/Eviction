const { modelQueryConfig } = require('./config');
const { authenticateRequest, constructQuery } = require('./utils');

const RestQueryConstructor = async ({ req, model }) => {
	const queryConfig = modelQueryConfig[model];

	const deselectArray = queryConfig.globalDeselectFields
		? queryConfig.globalDeselectFields
		: [];

	const returnObj = {
		authorized: false,
		authenticated: false,
		query: {},
		limit: Number(req.query.limit) || 0,
		errMessage: '',
		deselectString: '',
		sortString:
			req.query.sort && queryConfig.filingDate
				? req.query.sort === 'asc'
					? queryConfig.filingDate.iso
					: req.query.sort === 'desc'
					? `-${queryConfig.filingDate.iso}`
					: ''
				: '',
		type: req.query.type && req.query.type === 'csv' ? 'csv' : 'json',
		apiKeyObj: {}
	};

	if (queryConfig.authenticate) {
		// Authenticate API Key
		const { isAuthenticated, authMessage, apiKey } = await authenticateRequest(
			req
		);
		returnObj.authenticated = isAuthenticated;
		returnObj.errMessage = authMessage;
		returnObj.apiKeyObj.id = apiKey._id;
		returnObj.apiKeyObj.history = apiKey.history;

		queryConfig.apiKey = apiKey;
		returnObj.apiKeyObj.id = apiKey._id;

		if (!apiKey.global && apiKey.permissions.deselectedFields[0]) {
			// Add deselected fields to nonQueryFields
			queryConfig.nonQueryFields.push(...apiKey.permissions.deselectedFields);
			deselectArray.push(...apiKey.permissions.deselectedFields);
		}
	} else {
		returnObj.authenticated = true;
		queryConfig.apiKey = { global: true };
	}

	if (returnObj.authenticated) {
		const { query, queryMessage, isConstructed } = constructQuery(
			req.query,
			queryConfig
		);

		returnObj.authorized = isConstructed;
		returnObj.query = query;
		returnObj.errMessage = queryMessage;
	}

	if (returnObj.type === 'csv' && queryConfig.csvDeselectFields) {
		deselectArray.push(...queryConfig.csvDeselectFields);
	}

	// removes duplicates and creates a deselect string for mongoose
	returnObj.deselectString = deselectArray[0]
		? [...new Set(deselectArray)].map(item => `-${item}`).join(' ')
		: '';

	return returnObj;
};

module.exports = RestQueryConstructor;
