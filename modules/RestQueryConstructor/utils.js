const moment = require('moment');
// const authArr = JSON.parse(process.env.API_KEY_ARR);
const db = require('../../models');
const { auth, verify, dates } = require('./config').errStrings;

// All dates in objects are already a moment.js 'valueOf()' value
const verifyDateQuery = ({ permissions, requested }) => {
	const result = { isVerified: false, errMessage: '' };

	const permissionDateValues = permissions.value
		.split('-')
		.map(item => moment(item, 'MM/DD/YYYY').valueOf());

	if (typeof requested.value === 'string') {
		const reqDateArr = requested.value.split('-');

		switch (`${permissions.type}-${requested.type}`) {
			case 'year-year':
				if (permissions.value === requested.value) {
					result.isVerified = true;
				}
				break;
			case 'year-date':
				if (
					reqDateArr
						.map(item => item.split('/')[2])
						.every(item => item === permissions.value)
				) {
					result.isVerified = true;
				}
				break;
			case 'date-date':
				const reqDateValues = reqDateArr.map(item =>
					moment(item, 'MM/DD/YYYY').valueOf()
				);

				if (
					// both are ranges & request is within permission range
					(permissionDateValues.length === 2 &&
						reqDateValues.length === 2 &&
						permissionDateValues[0] <= reqDateValues[0] &&
						permissionDateValues[1] >= reqDateValues[1]) ||
					// range permission / single date query & request is within permission
					(permissionDateValues.length === 2 &&
						reqDateValues.length === 1 &&
						permissionDateValues[0] <= reqDateValues[0] &&
						permissionDateValues[1] >= reqDateValues[0]) ||
					// both are single date & they match
					(permissionDateValues.length === 1 &&
						reqDateValues.length === 1 &&
						permissionDateValues[0] === reqDateValues[0])
				) {
					result.isVerified = true;
				}
			case 'date-year':
				if (
					permissions.value ===
					`01/01/${requested.value}-12/31/${requested.value}`
				) {
					result.isVerified = true;
				}
			default:
				break;
		}
	} else {
		// request is an array of dates
		if (
			requested.value
				.map(item => item.split('-'))
				.every(item => item.length === 1)
		) {
			switch (`${`${permissions.type}-${requested.type}`}`) {
				case 'year-date':
					if (
						requested.value.every(
							item => item.split('/')[2] === permissions.value
						)
					) {
						result.isVerified = true;
					}

					break;
				case 'date-date':
					if (
						permissionDateValues.length === 2 &&
						requested.value
							.map(item => moment(item, 'MM/DD/YYYY').valueOf())
							.every(
								item =>
									item >= permissionDateValues[0] &&
									item <= permissionDateValues[1]
							)
					) {
						result.isVerified = true;
					}

				default:
					break;
			}
		} else {
			result.errMessage = dates.rangeOrMultipleDates;
			return result;
		}
	}

	if (!result.isVerified) {
		result.errMessage = verify.unauthorizedQuery(
			requested.key,
			permissions.value
		);
	}

	return result;
};

const verifyNonDateQuery = ({ key, queryVal, permissionVal }) => {
	const result = { isVerified: false, errMessage: '' };
	if (
		(typeof queryVal === 'string' &&
			typeof permissionVal === 'string' &&
			queryVal === permissionVal) || // string values match
		(typeof queryVal === 'string' &&
			typeof permissionVal === 'object' &&
			permissionVal.includes(queryVal)) || // permission array includes queried value
		(typeof queryVal === 'object' &&
			typeof permissionVal === 'object' &&
			queryVal.every(item => permissionVal.includes(item))) // permission array contains all items in query array
	) {
		result.isVerified = true;
	} else {
		result.errMessage = verify.unauthorizedQuery(key, permissionVal);
	}

	return result;
};

const verifyQuery = (queryObj, queryConfig) => {
	const { yearQueryField, filingDate, apiKey } = queryConfig;
	const permissionsQuery = apiKey.permissions.query;

	const returnObj = {
		verified: true,
		verifyMessage: ''
	};

	for (const [key, val] of Object.entries(queryObj)) {
		if (key === yearQueryField || key === filingDate.field) {
			if (queryObj[yearQueryField] && queryObj[filingDate.field]) {
				returnObj.verified = false;
				returnObj.verifyMessage = dates.dateAndYear;
				return returnObj;
			}

			if (
				permissionsQuery[yearQueryField] ||
				permissionsQuery[filingDate.field]
			) {
				const verifyDatesConfig = {};

				verifyDatesConfig.permissions = permissionsQuery[yearQueryField]
					? {
							type: 'year',
							key: yearQueryField,
							value: permissionsQuery[yearQueryField]
					  }
					: {
							type: 'date',
							key: filingDate.field,
							value: permissionsQuery[filingDate.field]
					  };

				verifyDatesConfig.requested =
					key === yearQueryField
						? {
								type: 'year',
								key: yearQueryField
						  }
						: { type: 'date', key: filingDate.field };

				verifyDatesConfig.requested.value = val;

				const { isVerified, errMessage } = verifyDateQuery(verifyDatesConfig);

				if (!isVerified) {
					returnObj.verified = false;
					returnObj.verifyMessage = errMessage;

					return returnObj;
				}
			}
		} else {
			if (permissionsQuery[key]) {
				const { isVerified, errMessage: nonDateErrMsg } = verifyNonDateQuery({
					queryVal: val,
					permissionVal: permissionsQuery[key],
					key
				});

				if (!isVerified) {
					returnObj.verified = false;
					returnObj.verifyMessage = nonDateErrMsg;

					return returnObj;
				}
			}
		}
	}

	return returnObj;
};

const constructDateQuery = (queryObj, queryConfig) => {
	const { filingDate, yearQueryField } = queryConfig;

	const returnObj = {
		filingDateQuery: {},
		dateMessage: '',
		dateConstructed: false
	};

	// First checks if date query is for a single date before building
	if (
		queryObj[filingDate.field] &&
		!queryObj[yearQueryField] &&
		typeof queryObj[filingDate.field] === 'string' &&
		!queryObj[filingDate.field].split('-')[1]
	) {
		returnObj['filingDateQuery'][filingDate.field] = queryObj[filingDate.field];
		returnObj.dateConstructed = true;
	} else {
		const dateQueryConfigObj = {};

		if (queryObj[filingDate.field] && queryObj[yearQueryField]) {
			dateQueryConfigObj.value = dates.dateAndYear;
			dateQueryConfigObj.type = 'error';
		} else if (queryObj[filingDate.field]) {
			dateQueryConfigObj.value = queryObj[filingDate.field];
			dateQueryConfigObj.type =
				typeof queryObj[filingDate.field] === 'object' ? 'filingDate' : 'range';
		} else {
			const attemptedYearRange = queryObj[yearQueryField].split('-')[1];

			dateQueryConfigObj.value = !attemptedYearRange
				? queryObj[yearQueryField]
				: dates.multipleYears(yearQueryField);
			dateQueryConfigObj.type = !attemptedYearRange ? 'year' : 'error';
		}

		switch (dateQueryConfigObj.type) {
			case 'filingDate':
				returnObj['filingDateQuery'][filingDate.field] =
					dateQueryConfigObj.value;
				returnObj.dateConstructed = true;
				break;

			case 'range':
				const [startDate, endDate] = dateQueryConfigObj.value.split('-');

				returnObj['filingDateQuery'][filingDate.iso] = {
					$gte: startDate,
					$lte: endDate
				};
				returnObj.dateConstructed = true;

				break;

			case 'year':
				returnObj['filingDateQuery'][filingDate.field] = {
					$regex: dateQueryConfigObj.value,
					$options: 'i'
				};
				returnObj.dateConstructed = true;
				break;

			case 'error':
				returnObj.dateMessage = dateQueryConfigObj.value;
				break;

			default:
				returnObj.dateMessage = dates.noDateQueryType;
				break;
		}
	}

	return returnObj;
};

const constructCoordinateRange = coordinate => {
	const decimalDigits = 13;
	let start = +coordinate;
	let end = start;

	const splitNum = coordinate.split('.');

	if (splitNum[1]) {
		const numDec = splitNum[1].length;
		const decimalsToAdd = decimalDigits - numDec;
		console.log('dec', decimalDigits, numDec);

		if (decimalsToAdd > 0) {
			console.log('hit');
			const numToAdd = +`0.${splitNum[1]}${'9'.repeat(decimalsToAdd)}`;
			console.log({ numToAdd });

			// handle negative coordinate
			if (start < 0) {
				end = start;
				start = +splitNum[0] - numToAdd;
			} else {
				end = +splitNum[0] + numToAdd;
			}
		}
	} else {
		// handle negative coordinate
		if (start < 0) {
			end = start;
			start = start - 0.99999999999999;
		} else {
			end = start + 0.99999999999999;
		}
	}

	return { start, end };
};

const constructQuery = (queryObj, queryConfig) => {
	const {
		nonQueryFields,
		filingDate,
		yearQueryField,
		apiKey,
		regexQueryFields,
		stringCase
	} = queryConfig;

	const returnObj = {
		isConstructed: false,
		query: {},
		queryMessage: ''
	};

	const filingDateField = filingDate ? filingDate.field : '';

	// Temp query object that will be used to configure query correctly before sending out
	const constructedQueryObj = {};

	for (const [key, val] of Object.entries(queryObj)) {
		// Add fields except: date queries & non query fields to the returned query
		const value =
			stringCase && stringCase === 'lowercase' && typeof val === 'string'
				? val.toLowerCase()
				: stringCase && stringCase === 'uppercase' && typeof val === 'string'
				? val.toUpperCase()
				: val;

		if (
			key !== yearQueryField &&
			key !== filingDateField &&
			!nonQueryFields.includes(key)
		) {
			returnObj['query'][key] = value;
		}

		// constructed query obj will include dates that will be evaluated later
		constructedQueryObj[key] = value;
	}

	const permissionsQueryArr =
		apiKey && !apiKey.global ? Object.entries(apiKey.permissions.query) : [];

	if (permissionsQueryArr[0]) {
		// verifies requested query by comparing to permissions query
		const { verified, verifyMessage } = verifyQuery(
			constructedQueryObj,
			queryConfig
		);

		returnObj.isConstructed = verified;
		returnObj.queryMessage = verifyMessage;

		if (verified) {
			for (const [key, val] of Object.entries(apiKey.permissions.query)) {
				// add all permissions to final query except: existing verified queries, dates and geometry
				if (
					!returnObj.query[key] &&
					key !== filingDate.field &&
					key !== yearQueryField &&
					key !== 'geometry'
				) {
					returnObj.query[key] = val;
				}

				// add all permissions to constructedQueryObj except: existing verified queries and dates
				if (
					!constructedQueryObj[key] &&
					key !== filingDate.field &&
					key !== yearQueryField
				) {
					constructedQueryObj[key] = val;
				}

				// add date permission to constructedQueryObj if none exist or an alternative date query doesn't exist
				if (
					(key === filingDate.field &&
						!constructedQueryObj[key] &&
						!constructedQueryObj[yearQueryField]) ||
					(key === yearQueryField &&
						!constructedQueryObj[yearQueryField] &&
						!constructedQueryObj[filingDate.field])
				) {
					constructedQueryObj[key] = val;
				}
			}
		}
	} else {
		returnObj.isConstructed = true;
	}

	// handle date query
	if (
		returnObj.isConstructed &&
		(constructedQueryObj[filingDateField] ||
			constructedQueryObj[yearQueryField])
	) {
		const { filingDateQuery, dateMessage, dateConstructed } =
			constructDateQuery(constructedQueryObj, queryConfig);

		returnObj.query = { ...returnObj.query, ...filingDateQuery };
		returnObj.queryMessage = dateMessage;
		returnObj.isConstructed = dateConstructed;
	}

	// handle geometry query
	if (returnObj.isConstructed && constructedQueryObj.geometry) {
		returnObj.query.geometry = {
			$geoWithin: { $geometry: constructedQueryObj.geometry }
		};
	}

	// handle regex search queries
	if (regexQueryFields) {
		for (const { field, type } of regexQueryFields) {
			if (returnObj.query[field]) {
				if (type === 'string') {
					returnObj.query[field] = {
						$regex: returnObj.query[field],
						$options: 'i'
					};
				}

				// LONGITUDE & LATITUDE
				if (type === 'coordinate') {
					// Simulates a string search by creating a range from the query value to that same number with trailing 9's as decimal digits
					// Will not create range for exact coordinates
					const { start, end } = constructCoordinateRange(
						returnObj.query[field]
					);

					returnObj.query[field] = {
						$gte: start,
						$lte: end
					};
				}
			}
		}
	}
	return returnObj;
};

const authenticateRequest = async req => {
	const returnObj = { isAuthenticated: false, apiKey: {}, authMessage: '' };

	if (req.headers.authorization) {
		returnObj.authMessage = auth.tokenAttempt;
	} else if (req.query.apiKey) {
		const apiKeyDoc = await db.apiKey
			.findOne({ apiKey: req.query.apiKey })
			.select('permissions global history')
			.lean();

		if (apiKeyDoc) {
			returnObj.isAuthenticated = true;
			returnObj.apiKey = { ...apiKeyDoc };
		} else {
			returnObj.authMessage = auth.invalidApiKey;
		}
	} else {
		returnObj.authMessage = auth.noApiKey;
	}

	return returnObj;
};

module.exports = { authenticateRequest, constructQuery };
