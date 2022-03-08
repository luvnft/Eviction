module.exports = {
	modelQueryConfig: {
		filingsByTractDaily: {
			authenticate: true,
			allowFindAll: false,
			queryableFields: ['_id', 'FilingDate', 'TractID', 'CountyID'],
			singleQueryFields: ['CountyID', 'Year'],
			forcedFields: [
				{
					key: 'CountyID',
					text: 'CountyID or TractID',
					altFields: ['TractID']
				},
				{ key: 'FilingDate', text: 'FilingDate or Year', altFields: ['Year'] }
			],
			overrideQueryRulesFields: ['_id'],
			dateRangeQueryLimit: { ms: 15778476000, text: '6 months' }, // 6 months: 15778476000, 1 year: 31556952000
			filingDateField: 'FilingDate',
			yearQueryField: 'Year'
		},
		cases: {
			authenticate: true,
			allowFindAll: false,
			queryableFields: [
				'_id',
				'filingDate',
				'latitude',
				'longitude',
				'county',
				'tractID',
				'id',
				'city',
				'zip',
				'geometry'
			],
			singleQueryFields: ['county', 'year', 'city', 'zip'],
			forcedFields: [
				{
					key: 'county',
					text: 'county, tractID, city or zip',
					altFields: ['tractID', 'city', 'zip']
				},
				{ key: 'filingDate', text: 'filingDate or year', altFields: ['year'] }
			],
			overrideQueryRulesFields: ['_id', 'id', 'geometry'],
			dateRangeQueryLimit: { ms: 15778476000, text: '6 months' }, // 6 months: 15778476000, 1 year: 31556952000
			filingDateField: 'filingDate',
			yearQueryField: 'year'
		},
		buildings: {
			authenticate: false,
			allowFindAll: true,
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
			allowFindAll: true,
			queryableFields: ['_id', 'FilingMonth', 'CountyID'],
			filingDateField: 'FilingMonth',
			yearQueryField: 'Year'
		},
		filingsByCountyWeek: {
			authenticate: false,
			allowFindAll: true,
			queryableFields: ['_id', 'FilingWeek', 'CountyID'],
			filingDateField: 'FilingWeek',
			yearQueryField: 'Year'
		},
		filingsByTractMonth: {
			authenticate: false,
			allowFindAll: true,
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
