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
				limit,
				type,
				deselectString
			} = await RestQueryConstructor({
				model: 'buildings',
				req
			});

			if (authorized && authenticated) {
				const data = deselectString
					? await db.building
							.find(query)
							.limit(limit)
							.select(deselectString)
							.lean()
					: await db.building.find(query).limit(limit).lean();

				if (type === 'csv' && data[0]) {
					const fileName = `atlanta_region_eviction_tracker_buildings_${Date.now()}.csv`;
					const csvStr = await ArrayToCsvString({
						array: data,
						model: 'filingsByCountyWeek'
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
	}
};
