const { modelQueryConfig } = require('./config');
const { authenticateRequest, constructQuery } = require('./utils');

const RestQueryConstructor = async ({ req, model }) => {
	const queryConfig = modelQueryConfig[model];

	const returnObj = {
		authorized: false,
		authenticated: !queryConfig.authenticate,
		permissions: {},
		query: {},
		limit: Number(req.query.limit) || 0,
		errMessage: '',
		// Fields that will be left off of the return
		deselectString: queryConfig.globalDeselectFields
			? queryConfig.globalDeselectFields.map(field => `-${field}`).join(' ')
			: '',
		sortString:
			req.query.sort && queryConfig.filingDate
				? req.query.sort === 'asc'
					? queryConfig.filingDate.iso
					: req.query.sort === 'desc'
					? `-${queryConfig.filingDate.iso}`
					: ''
				: ''
	};

	if (!returnObj.authenticated) {
		const { isAuthenticated, authMessage, permissions } =
			await authenticateRequest(req);

		queryConfig.permissions = permissions;

		if (!permissions.global) {
			// no global permissions so protected fields will be added to deselect string
			const protectedFieldsDeselectString = queryConfig.queryableFields
				? queryConfig.queryableFields
						.filter(item => item.protected)
						.map(({ field }) => `-${field}`)
						.join(' ')
				: '';

			returnObj.deselectString = returnObj.deselectString
				? `${returnObj.deselectString} ${protectedFieldsDeselectString}`
				: protectedFieldsDeselectString;
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

	return returnObj;
};

module.exports = RestQueryConstructor;
