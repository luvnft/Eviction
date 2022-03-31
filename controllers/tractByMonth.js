const tractsByMonth = require('../models/filingsByTractMonth');
const RestQueryConstructor = require('../modules/RestQueryConstructor');

module.exports = {
	findAll: async (req, res) => {
		try {
			const { query, authorized, authenticated, errMessage, limit } =
				await RestQueryConstructor({
					model: 'filingsByTractMonth',
					req
				});

			if (authorized && authenticated) {
				const data = await tractsByMonth.find(query).limit(limit).lean();

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
