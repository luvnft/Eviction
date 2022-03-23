module.exports = {
	modelQueryConfig: {
		filingsByTractDaily: {
			authenticate: false,
			queryableFields: ['_id', 'FilingDate', 'TractID', 'CountyID'],
			filingDateField: 'FilingDate',
			yearQueryField: 'Year'
		},
		cases: {
			authenticate: true,
			queryableFields: [
				'_id',
				'fileDate',
				'latitude',
				'longitude',
				'county',
				'tractID',
				'id',
				'city',
				'zip',
				'geometry',
				'judgment',
				'defaultJudgment',
				'answer',
				'services',
				'dismiss',
				'caseStatus',
				'blockGroupID',
				'caseID',
				'streetAddress',
				'address'
			],
			deselectFields: ['defendantName1', 'defendantName2'],
			singleQueryFields: ['year', 'city', 'zip'],
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
				'defendantName1',
				'streetAddress',
				'address'
			],
			dateRangeQueryLimit: { ms: 31556952000, text: '1 year' }, // 6 months: 15778476000, 1 year: 31556952000
			filingDateField: 'fileDate',
			yearQueryField: 'year',
			countyField: 'county'
		},
		buildings: {
			authenticate: false,
			queryableFields: [
				'_id',
				'street',
				'latitude',
				'longitude',
				'county',
				'geometry',
				'tractid',
				'blockgroupid',
				'city',
				'zip'
			]
		},
		filingsByCountyMonth: {
			authenticate: false,
			queryableFields: ['_id', 'FilingMonth', 'CountyID'],
			filingDateField: 'FilingMonth',
			yearQueryField: 'Year'
		},
		filingsByCountyWeek: {
			authenticate: false,
			queryableFields: ['_id', 'FilingWeek', 'CountyID'],
			filingDateField: 'FilingWeek',
			yearQueryField: 'Year'
		},
		filingsByTractMonth: {
			authenticate: false,
			queryableFields: ['_id', 'TractID', 'CountyID']
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
			}
		},
		dates: {
			dateAndYear:
				'Error: Cannot query both a single date/date range and a year. Please choose one or the other.',
			multipleDateRanges: 'Error: Cannot query multiple date ranges.',
			singleDateAndRange:
				'Error: Cannot query a date range and a single date. Please choose one or the other.',
			invalidRange: limit =>
				`Error: Date range queries for this API are limited to ${limit}`,
			multipleYears: field =>
				`Error: Cannot query a range of years. Please only enter one year (e.g., ${field}=2022)`
		}
	}
};
