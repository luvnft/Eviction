module.exports = {
	modelQueryConfig: {
		cases: {
			authenticate: true,
			queryableFields: [
				{ field: '_id', protected: true },
				{ field: 'fileDate', protected: false },
				{ field: 'answer', protected: false },
				{ field: 'latitude', protected: false },
				{ field: 'longitude', protected: false },
				{ field: 'services', protected: false },
				{ field: 'dismiss', protected: false },
				{ field: 'defaultJudgment', protected: false },
				{ field: 'judgment', protected: false },
				{ field: 'answerDate', protected: false },
				{ field: 'servicesDate', protected: false },
				{ field: 'dismissDate', protected: false },
				{ field: 'defaultJudgmentDate', protected: false },
				{ field: 'judgmentDate', protected: false },
				{ field: 'tractID', protected: false },
				{ field: 'blockGroupID', protected: false },
				{ field: 'id', protected: true },
				{ field: 'streetAddress', protected: false },
				{ field: 'city', protected: false },
				{ field: 'zip', protected: false },
				{ field: 'county', protected: false },
				{ field: 'geometry', protected: false },
				{ field: 'caseID', protected: true },
				{ field: 'plaintiff', protected: true },
				{ field: 'defendantName1', protected: true },
				{ field: 'defendantName2', protected: true },
				{ field: 'attorney', protected: true },
				{ field: 'judgmentType', protected: false },
				{ field: 'judgmentFor', protected: false },
				{ field: 'caseStatus', protected: false },
				{ field: 'address', protected: false },
				{ field: 'year', protected: false }
			],
			globalDeselectFields: [
				'answerDateISO',
				'defaultJudgmentDateISO',
				'dismissDateISO',
				'fileDateISO',
				'judgmentDateISO',
				'servicesDateISO'
			],
			singleQueryFields: ['year'],
			forcedFields: [
				{
					key: 'county',
					text: 'county, tractID, blockGroupID, city, or zip',
					altFields: ['tractID', 'city', 'zip', 'blockGroupID']
				},
				{ key: 'fileDate', text: 'fileDate or year', altFields: ['year'] }
			],
			overrideQueryRulesFields: [
				'_id',
				'id',
				'geometry',
				'blockGroupID',
				'caseID',
				'streetAddress',
				'address'
			],
			dateRangeQueryLimit: { ms: 31556952000, text: '1 year' }, // 6 months: 15778476000, 1 year: 31556952000
			filingDate: { field: 'fileDate', iso: 'fileDateISO' },
			yearQueryField: 'year',
			countyField: 'county'
		},
		filingsByTractDaily: {
			authenticate: false,
			queryableFields: [
				{ field: '_id', protected: false },
				{ field: 'FilingDate', protected: false },
				{ field: 'TractID', protected: false },
				{ field: 'CountyID', protected: false },
				{ field: 'Year', protected: false }
			],
			filingDate: { field: 'FilingDate', iso: 'FilingDateISO' },
			yearQueryField: 'Year',
			globalDeselectFields: ['FilingDateISO']
		},
		filingsByCountyMonth: {
			authenticate: false,
			queryableFields: [
				{ field: '_id', protected: false },
				{ field: 'FilingMonth', protected: false },
				{ field: 'CountyID', protected: false },
				{ field: 'Year', protected: false }
			],
			filingDate: { field: 'FilingMonth', iso: 'FilingMonthISO' },
			globalDeselectFields: ['FilingMonthISO'],
			yearQueryField: 'Year'
		},
		filingsByCountyWeek: {
			authenticate: false,
			queryableFields: [
				{ field: '_id', protected: false },
				{ field: 'FilingWeek', protected: false },
				{ field: 'CountyID', protected: false },
				{ field: 'Year', protected: false }
			],
			filingDate: { field: 'FilingWeek', iso: 'FilingWeekISO' },
			globalDeselectFields: ['FilingWeekISO'],
			yearQueryField: 'Year'
		},
		filingsByTractMonth: {
			authenticate: false,
			queryableFields: [
				{ field: '_id', protected: false },
				{ field: 'TractID', protected: false },
				{ field: 'CountyID', protected: false }
			]
		},
		buildings: {
			authenticate: false,
			queryableFields: [
				{ field: '_id', protected: false },
				{ field: 'street', protected: false },
				{ field: 'latitude', protected: false },
				{ field: 'longitude', protected: false },
				{ field: 'county', protected: false },
				{ field: 'geometry', protected: false },
				{ field: 'tractid', protected: false },
				{ field: 'blockgroupid', protected: false },
				{ field: 'city', protected: false },
				{ field: 'zip', protected: false }
			]
		}
	},
	errStrings: {
		auth: {
			tokenAttempt:
				'Error: This API no longer uses tokens for authentication. Please take your token and pass it into the query (e.g., apiKey={YOUR TOKEN}). Then remove the authorization header.',
			noApiKey:
				'Error: Please ensure your API Key is included in the query, e.g., apiKey={YOUR API KEY}',
			invalidApiKey: 'Error: Invalid API Key. Please check apiKey for errors.'
		},
		verify: {
			noQuery: field =>
				`Error: A query must be made for this API. Please add a query to request and try again (e.g., ${field}={SOME VALUE}).`,
			singleQueriesNotMet: arr =>
				`Error: [${arr.join(', ')}] cannot have multiple queries.`,
			forcedQueriesNotMet: arr => {
				const forcedFieldsStr = arr.map(({ text }) => text).join(' AND ');

				const exampleStr = arr
					.map(({ key }) => `${key}={SOME VALUE}`)
					.join('&');

				return `Error: [${forcedFieldsStr}] must be present in a query to get a response. (e.g., ${exampleStr})`;
			},
			noCounty: countyArr =>
				`Error: No county query present. Please query by a county you have permissions for. Counties you can make requests for: ${countyArr.join(
					', '
				)}`,
			unauthorizedCounty: countyArr =>
				`Error: Unauthorized county request. Counties you can make requests for: ${countyArr.join(
					', '
				)}`
		},
		dates: {
			dateAndYear:
				'Error: Cannot query both a single date/date range and a year. Please choose one or the other.',
			multipleDateRanges: 'Error: Cannot query multiple date ranges.',
			singleDateAndRange:
				'Error: Cannot query a date range and a single date. Please choose one or the other.',
			noDateQueryType: 'Error: Query type case not met.',
			invalidRange: limit =>
				`Error: Date range queries for this API are limited to ${limit}`,
			multipleYears: field =>
				`Error: Cannot query a range of years. Please only enter one year (e.g., ${field}=2022)`
		}
	}
};
