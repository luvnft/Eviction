const db = require('../models');
const RestQueryConstructor = require('../modules/RestQueryConstructor');

// Defining methods
module.exports = {
	find: async (req, res) => {
		try {
			const { query, authorized, authenticated, errMessage, limit } =
				await RestQueryConstructor({
					model: 'buildings',
					req
				});

			if (authorized && authenticated) {
				const data = await db.building.find(query).limit(limit).lean();
				return res.status(200).json(data);
			} else {
				return res.status(422).json(errMessage);
			}
		} catch (err) {
			// console.log(err);
			res.status(422).json(err);
		}
	}
};
