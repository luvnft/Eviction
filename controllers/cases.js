const db = require('../models');
const RestQueryConstructor = require('../modules/RestQueryConstructor');
const { handleResLog, sortByDate } = require('./utils');

module.exports = {
	find: async (req, res) => {
		try {
			const {
				query,
				authorized,
				authenticated,
				errMessage,
				limit,
				deselectString
			} = await RestQueryConstructor({
				model: 'cases',
				req
			});

			if (authorized && authenticated) {
				const data = await db.cases
					.find(query)
					.select(deselectString)
					.limit(limit || 0)
					.lean();

				const sortedData = data.sort((a, b) => sortByDate(a, b, 'filingDate'));

				handleResLog({
					status: 200,
					numDocs: sortedData.length,
					url: req.originalUrl
				});
				return res.status(200).json(sortedData);
			} else {
				handleResLog({
					status: 422,
					numDocs: 0,
					url: req.originalUrl,
					errMessage
				});
				return res.status(422).json(errMessage);
			}
		} catch (err) {
			return res.status(422).json(err);
		}
	}
};
