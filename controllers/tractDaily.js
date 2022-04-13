const db = require('../models');
const RestQueryConstructor = require('../modules/RestQueryConstructor');
const ArrayToCsvString = require('../modules/ArrayToCsvString');

// Defining methods
module.exports = {
	find: async (req, res) => {
		try {
			const {
				query,
				authorized,
				authenticated,
				errMessage,
				deselectString,
				sortString,
				limit,
				type
			} = await RestQueryConstructor({
				model: 'filingsByTractDaily',
				req
			});

			if (authorized && authenticated) {
				const data = sortString
					? await db.tractDaily
							.find(query)
							.limit(limit)
							.sort(sortString)
							.select(deselectString)
							.lean()
					: await db.tractDaily
							.find(query)
							.limit(limit)
							.select(deselectString)
							.lean();

				if (type === 'csv' && data[0]) {
					const fileName = `atlanta_region_eviction_tracker_tract-daily_${Date.now()}.csv`;
					const csvStr = await ArrayToCsvString({
						array: data,
						model: 'filingsByTractDaily'
					});

					return res.status(200).attachment(fileName).send(csvStr);
				} else {
					return res.status(200).json(data);
				}
			} else {
				return res.status(422).json(errMessage);
			}
		} catch (err) {
			console.log(err);
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
