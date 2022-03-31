const db = require('../models');
const RestQueryConstructor = require('../modules/RestQueryConstructor');

module.exports = {
	find: async (req, res) => {
		try {
			const {
				query,
				authorized,
				authenticated,
				errMessage,
				limit,
				deselectString,
				sortString
			} = await RestQueryConstructor({
				model: 'cases',
				req
			});

			if (authorized && authenticated) {
				const data = sortString
					? await db.cases
							.find(query)
							.limit(limit)
							.sort(sortString)
							.select(deselectString)
							.lean()
					: await db.cases
							.find(query)
							.limit(limit)
							.select(deselectString)
							.lean();

				return res.status(200).json(data);
			} else {
				return res.status(422).json(errMessage);
			}
		} catch (err) {
			// console.log(err);
			return res
				.status(422)
				.json('Unprocessable Entity - Please check request and try again.');
		}
	}
};
