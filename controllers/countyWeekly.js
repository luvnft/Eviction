const countyWeekly = require('../models/filingsByCountyWeek');
const RestQueryConstructor = require('../modules/RestQueryConstructor');

module.exports = {
	findAll: async (req, res) => {
		try {
			const {
				query,
				authorized,
				authenticated,
				errMessage,
				deselectString,
				sortString,
				limit
			} = await RestQueryConstructor({
				model: 'filingsByCountyWeek',
				req
			});

			if (authorized && authenticated) {
				const data = sortString
					? await countyWeekly
							.find(query)
							.limit(limit)
							.sort(sortString)
							.select(deselectString)
							.lean()
					: await countyWeekly
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
			res.status(422).json(err);
		}
	},
	insertMany: req => {
		countyWeekly
			.insertMany(req.body)
			.then(() => {
				console.log('database succesfully updated');
				process.exit(0);
			})
			.catch(err => {
				console.error(err);
				process.exit(1);
			});
	}
};
