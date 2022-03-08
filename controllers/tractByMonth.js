const tractsByMonth = require('../models/filingsByTractMonth');
const RestQueryConstructor = require('../modules/RestQueryConstructor');
const { sortByDate, handleResLog } = require('./utils');

module.exports = {
	findAll: async (req, res) => {
		try {
			const { query, authorized, authenticated, errMessage } =
				RestQueryConstructor({
					model: 'filingsByTractMonth',
					req
				});

			if (authorized && authenticated) {
				const data = await tractsByMonth.find(query);

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
	},
	insertMany: req => {
		tractsByMonth
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
