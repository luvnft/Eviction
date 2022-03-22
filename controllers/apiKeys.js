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
				const obj = { ...req.body, apiKey: await createHex() };
				console.log(obj);

				if (obj.admin || obj.global) {
					obj.permissions = {};
					obj.permissions.allCounties = true;
					obj.permissions.limit = 0;
				}

				const apiKeyExists = await db.apiKey.exists({ apiKey: obj.apiKey });

				if (!apiKeyExists) {
					const newApiKeyDoc = await db.apiKey.create(obj);

					res.status(200).json(newApiKeyDoc);
				} else {
					return res
						.status(400)
						.json('Duplicate API key generated. Please try again');
				}
			} else {
				return res
					.status(400)
					.json(
						'Unauthorized API key. Please check for errors. Note: You must have an admin API key to create new API keys for this API'
					);
			}
		} catch (err) {
			return res.status(400).json(err);
		}
	}
};
