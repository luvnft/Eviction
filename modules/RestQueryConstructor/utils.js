const authArr = JSON.parse(process.env.API_KEY_ARR);
const db = require('../../models');
const { auth, verify, dates } = require('./config').errStrings;

const verifyQuery = (queryObj, queryConfig) => {
	const {
		singleQueryFields,
		forcedFields,
		overrideQueryRulesFields,
		permissions,
		countyField
	} = queryConfig;

	const returnObj = {
		verified: true,
		verifyMessage: ''
	};

	const verifyObj = {
		numForcedQueries: forcedFields.length || 0,
		numForcedQueriesMet: 0,
		overrideQueryRules: false,
		countyQueryMet: false,
		singleQueriesMet: false
	};

	for (const [key, val] of Object.entries(queryObj)) {
		if (val) {
			if (key === countyField) {
				if (typeof val !== 'object') {
					verifyObj.countyQueryMet = permissions.counties.includes(val);
				} else {
					for (const countyId of val) {
						const countyPermitted = permissions.counties.includes(countyId);

						if (countyPermitted) {
							verifyObj.countyQueryMet = true;
						} else {
							verifyObj.countyQueryMet = false;
							break;
						}
					}
				}
			}

			// Ensures that queries on single query fields are singular (i.e., county=cobb instead of county=cobb&county=fulton)
			if (singleQueryFields && singleQueryFields.includes(key)) {
				verifyObj.singleQueriesMet = typeof val !== 'object';
			} else {
				verifyObj.singleQueriesMet = true;
			}

			// Override fields are verify specific to a record and will override any forced query rules (i.e., _id)
			if (overrideQueryRulesFields) {
				const containsOverrideQueryRulesField = overrideQueryRulesFields.some(
					field => key === field
				);

				if (containsOverrideQueryRulesField) {
					verifyObj.overrideQueryRules = true;
				}
			}

			// Forced Fields are required in a query (i.e., Filing date and county)
			if (forcedFields) {
				const containsForcedFieldOrAltField = forcedFields.some(
					field => field.key === key || field.altFields.includes(key)
				);

				if (containsForcedFieldOrAltField) verifyObj.numForcedQueriesMet += 1;
			}
		}
	}

	if (!verifyObj.singleQueriesMet) {
		returnObj.verified = false;
		returnObj.verifyMessage = verify.singleQueriesNotMet(singleQueryFields);
	}

	if (
		verifyObj.numForcedQueriesMet < verifyObj.numForcedQueries &&
		!verifyObj.overrideQueryRules
	) {
		const forcedQueriesErrStr = verify.forcedQueriesNotMet(forcedFields);
		const concatErrStr = returnObj.verifyMessage
			? `${returnObj.verifyMessage} / ${forcedQueriesErrStr}`
			: forcedQueriesErrStr;

		returnObj.verified = false;
		returnObj.verifyMessage = concatErrStr;
	}

	if (!verifyObj.countyQueryMet) {
		returnObj.verified = false;
		returnObj.verifyMessage = verify.unauthorizedCounty(
			permissions.counties || []
		);
	}

	return returnObj;
};

const handleDateQuery = (queryObj, queryConfig) => {
	const { filingDate, yearQueryField, dateRangeQueryLimit, permissions } =
		queryConfig;

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

				const isWithinRangeLimit = dateRangeQueryLimit
					? new Date(endDate).getTime() - new Date(startDate).getTime() <=
					  dateRangeQueryLimit.ms
					: true;

				if (permissions.global || isWithinRangeLimit) {
					returnObj['filingDateQuery'][filingDate.iso] = {
						$gte: startDate,
						$lte: endDate
					};
					returnObj.dateConstructed = true;
				} else {
					returnObj.dateMessage = dates.invalidRange(dateRangeQueryLimit.text);
				}

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

const constructQuery = (queryObj, queryConfig) => {
	const {
		queryableFields,
		filingDate,
		yearQueryField,
		countyField,
		permissions
	} = queryConfig;

	const returnObj = {
		isConstructed: false,
		query: {},
		queryMessage: '',
		constructedQueryObj: {}
	};

	const filingDateField = filingDate ? filingDate.field : '';

	const constructedQueryObj = {};

	if (!permissions.global) {
		for (const { field, protected } of queryableFields) {
			if (queryObj[field] && !protected) {
				// non global so only allowing unprotected fields to be added to query
				constructedQueryObj[field] = queryObj[field];

				if (
					field !== yearQueryField &&
					field !== filingDateField &&
					!protected
				) {
					returnObj['query'][field] = queryObj[field];
				}
			}
		}

		if (!Object.keys(constructedQueryObj)) {
			returnObj.queryMessage = verify.noQuery(queryableFields[0]);
		} else if (!constructedQueryObj[countyField]) {
			returnObj.queryMessage = verify.noCounty(
				permissions.counties ? permissions.counties : []
			);
		} else {
			const { verified, verifyMessage } = verifyQuery(
				constructedQueryObj,
				queryConfig
			);

			returnObj.isConstructed = verified;
			returnObj.queryMessage = verifyMessage;
		}
	} else {
		// const filingDateField = filingDate ? filingDateField : '';
		for (const { field } of queryableFields) {
			if (queryObj[field]) {
				constructedQueryObj[field] = queryObj[field];

				if (field !== yearQueryField && field !== filingDateField) {
					returnObj['query'][field] = queryObj[field];
				}
			}
		}

		returnObj.isConstructed = true;
	}

	if (
		returnObj.isConstructed &&
		(constructedQueryObj[filingDateField] ||
			constructedQueryObj[yearQueryField])
	) {
		const { filingDateQuery, dateMessage, dateConstructed } = handleDateQuery(
			constructedQueryObj,
			queryConfig
		);

		returnObj.query = { ...returnObj.query, ...filingDateQuery };
		returnObj.queryMessage = dateMessage;
		returnObj.isConstructed = dateConstructed;
	}

	return returnObj;
};

const authenticateRequest = async req => {
	const obj = { isAuthenticated: false, authMessage: '' };

	if (req.headers.authorization) {
		obj.authMessage = auth.tokenAttempt;
	} else if (req.query.apiKey) {
		const apiKeyDoc = await db.apiKey
			.findOne({ apiKey: req.query.apiKey })
			.select('global permissions')
			.lean();

		if (apiKeyDoc) {
			obj.isAuthenticated = true;

			if (apiKeyDoc.global || apiKeyDoc.admin) {
				obj.permissions = { global: true };
			} else {
				obj.permissions = apiKeyDoc.permissions;
			}
		} else {
			obj.authMessage = auth.invalidApiKey;
		}
	} else {
		obj.authMessage = auth.noApiKey;
	}
	return obj;
};

module.exports = { authenticateRequest, constructQuery };
