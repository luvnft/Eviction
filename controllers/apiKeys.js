const db = require('../models');
const { createHex } = require('./utils');

module.exports = {
	create: async (req, res) => {
		try {
			if (!req.params.auth) {
				return res
					.status(400)
					.json(
						'An admin API key is required to create API keys for this API.'
					);
			}

			const isAdminApiKey = await db.apiKey.exists({
				apiKey: req.params.auth,
				admin: true
			});

			if (isAdminApiKey) {
				const obj = { apiKey: await createHex() };

				if (req.body.admin) {
					obj.admin = true;
					obj.global = true;
				} else if (req.body.global) {
					obj.admin = false;
					obj.global = true;
				} else {
					const defaultPermissionsObj = {
						counties: ['063', '067', '089', '121', '135']
					};

					obj.admin = false;
					obj.global = false;
					obj.permissions = req.body.permissions
						? req.body.permissions
						: defaultPermissionsObj;
				}

				const newApiKeyDoc = await db.apiKey.create(obj);

				res.status(200).json(newApiKeyDoc);
			} else {
				return res
					.status(401)
					.json(
						'Unauthorized API key. Please check for errors. You must have an admin API key to create new API keys for this API'
					);
			}
		} catch (err) {
			// console.log(err);
			if (err.code === 11000 && err.keyPattern.apiKey) {
				return res
					.status(400)
					.json('Generated API key was a duplicate. Please try again.');
			}
			return res.status(400).json(err);
		}
	}
};
