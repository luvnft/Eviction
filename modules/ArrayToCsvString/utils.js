const moment = require('moment');

module.exports = {
	flattenObj: async config => {
		switch (config.type) {
			case 'setKeys':
				return config.flatKeys;
			case 'dateRange':
				const startDate = moment(config.startDate, 'MM/DD/YYYY');
				const endDate = moment(config.endDate, moment.ISO_8601);

				const result = [];

				if (config.flatKeys) {
					result.push(...config.flatKeys);
				}

				while (startDate.isBefore(endDate)) {
					result.push({
						dbKey: startDate.format('MM/01/YYYY'),
						csvKey: startDate.format('MMM YYYY')
					});
					startDate.add(1, 'month');
				}
				return result;
			default:
				return [];
		}
	}
};
