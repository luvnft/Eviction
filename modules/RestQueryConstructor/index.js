const { modelQueryConfig } = require('./config');
const { authenticateRequest, constructQuery } = require('./utils');

const RestQueryConstructor = ({ req, model }) => {
	const queryConfig = modelQueryConfig[model];

	const returnObj = {
		authorized: false,
		authenticated: false,
		query: {},
		errMessage: ''
	};

	if (queryConfig.authenticate) {
		const { isAuthenticated, authMessage } = authenticateRequest(req);

		returnObj.authenticated = isAuthenticated;
		returnObj.errMessage = authMessage;
	} else {
		returnObj.authenticated = true;
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

	return returnObj;
};

module.exports = RestQueryConstructor;
