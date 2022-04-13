const moment = require('moment');
const config = require('./config');
const { flattenObj } = require('./utils');

const objToCsvRow = async ({ dbObj, flattenConfig, csvHeaders, fields }) => {
	const csvRowConfig = {
		obj: {},
		result: ''
	};

	for await (const field of fields) {
		if ((flattenConfig && !flattenConfig[field]) || !flattenConfig) {
			if (dbObj[field] && typeof dbObj[field] === 'string') {
				csvRowConfig.obj[field] = dbObj[field].replace(/,/g, '');
			} else if (field === 'updatedOn') {
				// using moment(date, dateFormat) removes warning
				csvRowConfig.obj[field] = moment(dbObj[field], moment.ISO_8601).format(
					'MM/DD/YYYY'
				);
			} else {
				csvRowConfig.obj[field] = dbObj[field] || '';
			}
		} else {
			const flattenedKeysArr = await flattenObj(flattenConfig[field]);

			for await (const { csvKey, dbKey } of flattenedKeysArr) {
				if (dbObj[field][dbKey] && typeof dbObj[field][dbKey] === 'string') {
					csvRowConfig.obj[csvKey] = dbObj[field][dbKey].replace(/,/g, '');
				} else {
					csvRowConfig.obj[csvKey] = dbObj[field][dbKey] || '';
				}
			}
		}
	}

	if (!csvHeaders[0]) {
		csvHeaders.push(...Object.keys(csvRowConfig.obj));
		csvRowConfig.result = csvRowConfig.result.concat(csvHeaders.join(', '));
	}

	const csvRow = csvHeaders.map(key => csvRowConfig.obj[key] || '').join(', ');
	csvRowConfig.result = csvRowConfig.result.concat(`\n${csvRow}`);

	return csvRowConfig.result;
};

const ArrayToCsvString = async ({ array, model }) => {
	const modelConfig = config[model];
	const fields = Object.keys(array[0]);

	const csvObj = {
		headers: [],
		result: ''
	};

	for await (const caseObj of array) {
		const csvRow = await objToCsvRow({
			dbObj: caseObj,
			csvHeaders: csvObj.headers,
			flattenConfig:
				modelConfig && modelConfig.flattenConfig
					? modelConfig.flattenConfig
					: null,
			fields
		});

		csvObj.result += csvRow;
	}
	return csvObj.result;
};

module.exports = ArrayToCsvString;
