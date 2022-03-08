const countyMonthly = require('../models/filingsByCountyMonth');
const RestQueryConstructor = require('../modules/RestQueryConstructor');
const { sortByDate, handleResLog } = require('./utils');

module.exports = {
	findAll: async (req, res) => {
		try {
			const { query, authorized, authenticated, errMessage } =
				RestQueryConstructor({
					model: 'filingsByCountyMonth',
					req
				});

			if (authorized && authenticated) {
				const data = await countyMonthly.find(query);
				const sortedData = data.sort((a, b) => sortByDate(a, b, 'FilingMonth'));

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
			handleResLog({
				status: 422,
				numDocs: 0,
				url: req.originalUrl,
				errMessage: err
			});
			res.status(422).json(err);
		}
	},
	insertMany: req => {
		countyMonthly
			.insertMany(req.body)
			.then(() => {
				console.log('database successfully updated');
				process.exit(0);
			})
			.catch(err => {
				console.error(err);
				process.exit(1);
			});
	}
};
