const { modelQueryConfig } = require('./config');
const { authenticateRequest, constructQuery } = require('./utils');

const RestQueryConstructor = async ({ req, model }) => {
	const queryConfig = modelQueryConfig[model];

	const returnObj = {
		authorized: false,
		authenticated: false,
		permissions: {},
		query: {},
		limit: 0,
		errMessage: '',
		deselectString: queryConfig.deselectFields
			? queryConfig.deselectFields.map(field => `-${field}`).join(' ')
			: ''
	};

	if (queryConfig.authenticate) {
		const { isAuthenticated, authMessage, permissions } =
			await authenticateRequest(req);

		returnObj.authenticated = isAuthenticated;
		returnObj.errMessage = authMessage;

		queryConfig.permissions = permissions;
		returnObj.limit = permissions.limit;
	} else {
		returnObj.authenticated = true;
		queryConfig.permissions = { global: true };
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
