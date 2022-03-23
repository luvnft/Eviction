const authArr = JSON.parse(process.env.API_KEY_ARR);
const db = require('../../models');
const { auth, verify, dates } = require('./config').errStrings;

const createDateRangeRegExStr = ({ start, end, rangeLimitMS, global }) => {
	const startDateArr = start.split('/');
	const endDateArr = end.split('/');
	const startDateMS = new Date(start).getTime();
	const endDateMS = new Date(end).getTime();

	// checks if there is a range limit or date range is not more than range limit
	if (global || !rangeLimitMS || endDateMS - startDateMS <= rangeLimitMS) {
		const finalIterationMonthNum =
			startDateArr[2] === endDateArr[2]
				? Number(endDateArr[0])
				: Number(endDateArr[0]) + 12;

		const allPossibleDatesArr = [];

		for (
			let monthNum = Number(startDateArr[0]);
			monthNum <= finalIterationMonthNum;
			monthNum++
		) {
			const dateObj = {
				month: monthNum <= 12 ? monthNum : monthNum - 12,
				year: monthNum <= 12 ? startDateArr[2] : endDateArr[2]
			};

			const monthStr =
				dateObj.month.toString().length === 1
					? `0${dateObj.month}`
					: `${dateObj.month}`;

			const lastDayOfMonth = new Date(dateObj.year, monthStr, 0).getDate();

			for (let dateNum = 1; dateNum <= lastDayOfMonth; dateNum++) {
				const dateStr =
					dateNum.toString().length === 1 ? `0${dateNum}` : `${dateNum}`;

				allPossibleDatesArr.push(`${monthStr}/${dateStr}/${dateObj.year}`);
			}
		}

		return allPossibleDatesArr
			.filter(
				date =>
					startDateMS <= new Date(date).getTime() && endDateMS >= new Date(date)
			)
			.join('|');
	} else return '';
};

const verifyQuery = (queryConfig, queryObj) => {
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
		overrideQueryRules: permissions.global || false,
		singleQueriesMet: true,
		countyQueryMet: permissions.allCounties || false
	};

	for (const [key, val] of Object.entries(queryObj)) {
		if (val) {
			// Ensures that queries on single query fields are singular (i.e., county=cobb instead of county=cobb&county=fulton)
			if (typeof val === 'object' && singleQueryFields.indexOf(key) !== -1)
				verifyObj.singleQueriesMet = false;

			// Override fields are verify specific to a record and will override any forced query rules (i.e., _id)
			const containsOverrideQueryRulesField = overrideQueryRulesFields.some(
				field => key === field
			);

			if (containsOverrideQueryRulesField && !verifyObj.overrideQueryRules)
				verifyObj.overrideQueryRules = true;

			// Forced Fields are required in a query (i.e., Filing date and county)
			const containsForcedFieldOrAltField = forcedFields.some(
				field => field.key === key || field.altFields.indexOf(key) !== -1
			);

			if (containsForcedFieldOrAltField) verifyObj.numForcedQueriesMet += 1;
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
		// String means the query is only on one county. Object is an array of counties to query
		if (
			typeof queryObj[countyField] === 'string' &&
			permissions.counties.indexOf(queryObj[countyField]) === -1
		) {
			returnObj.verified = false;
			returnObj.verifyMessage = 'unauthorized county request';
		} else if (typeof queryObj[countyField] === 'object') {
			const containsUnauthorizedCounty =
				queryObj[countyField]
					.map(county =>
						permissions.counties.indexOf(county) !== -1 ? true : false
					)
					.indexOf(false) !== -1;

			if (containsUnauthorizedCounty) {
				returnObj.verified = false;
				returnObj.verifyMessage = 'unauthorized county request';
			}
		}
	}

	return returnObj;
};

const handleDateQuery = (queryObj, queryConfig) => {
	const { filingDateField, yearQueryField, dateRangeQueryLimit, permissions } =
		queryConfig;

	const dateQueryConfigObj =
		queryObj[filingDateField] && !queryObj[yearQueryField]
			? {
					// ensuring value is an array for type filingDate to assist with range queries
					value:
						typeof queryObj[filingDateField] === 'object'
							? queryObj[filingDateField]
							: [queryObj[filingDateField]],
					type: 'filingDate'
			  }
			: queryObj[yearQueryField] && !queryObj[filingDateField]
			? { value: queryObj[yearQueryField], type: 'year' }
			: {
					value: dates.dateAndYear,
					type: 'error'
			  };

	const returnObj = {
		filingDateQuery: {},
		dateMessage: '',
		dateConstructed: false
	};

	if (dateQueryConfigObj.type === 'filingDate') {
		const filingDateArr = dateQueryConfigObj.value;
		const rangeQuery = [];
		const filingDateQuery = [];

		for (const item of filingDateArr) {
			const datesArr = item.split('-');

			// if the query is for a date range, use regEx to query db
			if (datesArr[1]) {
				const regExStr = createDateRangeRegExStr({
					start: datesArr[0],
					end: datesArr[1],
					rangeLimitMS: dateRangeQueryLimit ? dateRangeQueryLimit.ms : null,
					global: permissions.global
				});

				if (regExStr) {
					rangeQuery.push({
						$regex: regExStr,
						$options: 'i'
					});
				}
			} else {
				filingDateQuery.push(item);
			}
		}

		if ((rangeQuery[0] && filingDateQuery[0]) || rangeQuery[1]) {
			returnObj.dateMessage = rangeQuery[1]
				? dates.multipleDateRanges
				: dates.singleDateAndRange;
		} else if (rangeQuery[0] || filingDateQuery[0]) {
			returnObj.filingDateQuery = rangeQuery[0]
				? rangeQuery[0]
				: filingDateQuery[1]
				? filingDateQuery
				: filingDateQuery[0];

			returnObj.dateConstructed = true;
		} else {
			returnObj.dateMessage = dates.invalidRange(dateRangeQueryLimit.text);
		}
	} else if (dateQueryConfigObj.type === 'year') {
		const attemptedYearRange = dateQueryConfigObj.value.split('-')[1];

		if (!attemptedYearRange) {
			returnObj.filingDateQuery = {
				$regex: dateQueryConfigObj.value,
				$options: 'i'
			};
			returnObj.dateConstructed = true;
		} else {
			returnObj.dateMessage = dates.multipleYears(yearQueryField);
		}
	} else {
		returnObj.dateMessage = dateQueryConfigObj.value;
	}
	return returnObj;
};

const constructQuery = (queryObj, queryConfig) => {
	const {
		queryableFields,
		forcedFields,
		singleQueryFields,
		filingDateField,
		yearQueryField,
		countyField,
		permissions
	} = queryConfig;

	const returnObj = { isConstructed: false, query: {}, queryMessage: '' };

	for (const field of queryableFields) {
		if (queryObj[field]) {
			returnObj['query'][field] = queryObj[field];
		}
	}

	const constructedQueryObj = queryObj[yearQueryField]
		? { ...returnObj.query, [yearQueryField]: queryObj[yearQueryField] }
		: returnObj.query;

	if (!Object.keys(constructedQueryObj)[0] && !permissions.global) {
		returnObj.queryMessage = verify.noQuery(queryableFields[0]);
	} else if (
		!permissions.global &&
		!permissions.allCounties &&
		!constructedQueryObj[countyField]
	) {
		returnObj.queryMessage = 'county field must be present';
	} else if (forcedFields || singleQueryFields || !permissions.global) {
		const { verified, verifyMessage } = verifyQuery(
			queryConfig,
			constructedQueryObj
		);

		returnObj.isConstructed = verified;
		returnObj.queryMessage = verifyMessage;
	} else {
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

		returnObj.query[filingDateField] = filingDateQuery;
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
			obj.permissions = { ...apiKeyDoc.permissions, global: apiKeyDoc.global };
		} else {
			obj.authMessage = auth.invalidApiKey;
		}
	} else {
		obj.authMessage = auth.noApiKey;
	}

	return obj;
};

module.exports = { authenticateRequest, constructQuery };
