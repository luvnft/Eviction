const db = require('../models');
const RestQueryConstructor = require('../modules/RestQueryConstructor');
const { handleResLog, sortByDate } = require('./utils');

// Defining methods
module.exports = {
	find: async (req, res) => {
		try {
			const { query, authorized, authenticated, errMessage } =
				await RestQueryConstructor({
					model: 'filingsByTractDaily',
					req
				});

			if (authorized && authenticated) {
				const data = await db.tractDaily.find(query).lean();
				const sortedData = data.sort((a, b) => sortByDate(a, b, 'FilingDate'));

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
			return res.status(422).json(err);
		}
	}
	// findAll: (req, res) => {
	// 	console.log(req.query);
	// 	filingsByTractDaily
	// 		.find(req.query)
	// 		// .sort({ date: -1 })
	// 		.then(dbModel => res.json(dbModel))
	// 		.catch(err => res.status(422).json(err));
	// },
	// create: (req, res) => {
	// 	console.log(req.body);
	// 	filingsByTractDaily
	// 		.create(req.body)
	// 		.then(dbModel => res.json(dbModel))
	// 		.catch(err => res.status(422).json(err));
	// }
	// update: (req, res) => {
	// 	const { _id } = req.body;
	// 	filingsByTractDaily
	// 		.findByIdAndUpdate(_id, req.body)
	// 		.then(dbModel => {
	// 			console.log('Update Evictions by Tract', req.body);
	// 			res.json(dbModel);
	// 		})
	// 		.catch(err => res.status(422).json(err));
	// }
};
