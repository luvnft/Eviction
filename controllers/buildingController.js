const db = require('../models');
const RestQueryConstructor = require('../modules/RestQueryConstructor');
const { sortByDate, handleResLog } = require('./utils');

// Defining methods
module.exports = {
	find: async (req, res) => {
		try {
			const { query, authorized, authenticated, errMessage } =
				await RestQueryConstructor({
					model: 'buildings',
					req
				});

			if (authorized && authenticated) {
				const data = await db.building.find(query).lean();

				handleResLog({
					status: 200,
					numDocs: data.length,
					url: req.originalUrl
				});
				return res.status(200).json(data);
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
			handleResLog({
				status: 422,
				numDocs: 0,
				url: req.originalUrl,
				errMessage: err
			});
			res.status(422).json(err);
		}
	}
};
