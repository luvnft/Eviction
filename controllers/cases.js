const db = require('../models');
const RestQueryConstructor = require('../modules/RestQueryConstructor');
const ArrayToCsvString = require('../modules/ArrayToCsvString');

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
				sortString,
				type
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

				if (type === 'csv' && data[0]) {
					const fileName = `atlanta_region_eviction_tracker_cases_${Date.now()}.csv`;
					const csvStr = await ArrayToCsvString({
						array: data,
						model: 'cases'
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
};
