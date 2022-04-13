const { modelQueryConfig } = require('./config');
const { authenticateRequest, constructQuery } = require('./utils');

const RestQueryConstructor = async ({ req, model }) => {
	const queryConfig = modelQueryConfig[model];

	const deselectArray = queryConfig.globalDeselectFields
		? queryConfig.globalDeselectFields
		: [];

	const returnObj = {
		authorized: false,
		authenticated: !queryConfig.authenticate,
		permissions: {},
		query: {},
		limit: Number(req.query.limit) || 0,
		errMessage: '',
		// Fields that will be left off of the return
		deselectString: '',
		sortString:
			req.query.sort && queryConfig.filingDate
				? req.query.sort === 'asc'
					? queryConfig.filingDate.iso
					: req.query.sort === 'desc'
					? `-${queryConfig.filingDate.iso}`
					: ''
				: '',
		type: req.query.type && req.query.type === 'csv' ? 'csv' : 'json'
	};

	if (!returnObj.authenticated) {
		const { isAuthenticated, authMessage, permissions } =
			await authenticateRequest(req);

		queryConfig.permissions = permissions;

		if (!permissions.global) {
			// no global permissions so protected fields will be added to deselect string
			const protectedFieldsDeselectArr = queryConfig.queryableFields
				? queryConfig.queryableFields
						.filter(item => item.protected)
						.map(({ field }) => field)
				: [];

			if (protectedFieldsDeselectArr[0]) {
				deselectArray.push(...protectedFieldsDeselectArr);
			}
		}

		returnObj.authenticated = isAuthenticated;
		returnObj.errMessage = authMessage;

		if (
			(permissions.limit && returnObj.limit > permissions.limit) ||
			(permissions.limit && returnObj.limit === 0)
		) {
			returnObj.limit = permissions.limit;
		}
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

	if (returnObj.type === 'csv' && queryConfig.csvDeselectFields) {
		deselectArray.push(...queryConfig.csvDeselectFields);
	}

	returnObj.deselectString = deselectArray[0]
		? [...new Set(deselectArray)].map(item => `-${item}`).join(' ')
		: '';

	return returnObj;
};

module.exports = RestQueryConstructor;
