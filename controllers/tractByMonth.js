const tractsByMonth = require('../models/filingsByTractMonth');
const RestQueryConstructor = require('../modules/RestQueryConstructor');
const ArrayToCsvString = require('../modules/ArrayToCsvString');

module.exports = {
	findAll: async (req, res) => {
		try {
			const {
				query,
				authorized,
				authenticated,
				errMessage,
				limit,
				deselectString,
				type
			} = await RestQueryConstructor({
				model: 'filingsByTractMonth',
				req
			});

			if (authorized && authenticated) {
				const data = deselectString
					? await tractsByMonth
							.find(query)
							.limit(limit)
							.select(deselectString)
							.lean()
					: await tractsByMonth.find(query).limit(limit).lean();
				if (type === 'csv' && data[0]) {
					const fileName = `atlanta_region_eviction_tracker_tract-month_${Date.now()}.csv`;
					const csvStr = await ArrayToCsvString({
						array: data,
						model: 'filingsByTractMonth'
					});

					return res.status(200).attachment(fileName).send(csvStr);
				} else {
					return res.status(200).json(data);
				}
			} else {
				return res.status(422).json(errMessage);
			}
		} catch (err) {
			// console.log(err);
			res.status(422).json(err);
		}
	},
	insertMany: req => {
		tractsByMonth
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
