const globalTableData = {
	type: {
		param: 'type',
		permission: 'Optional',
		description:
			'Specifies a file type for the returned data. Options: json or csv (e.g., type=csv). Default: json.'
	},
	sort: {
		param: 'sort',
		permission: 'Optional',
		description:
			'Specifies if response is sorted by date. Options: asc (ascending) or desc (descending). Example: sort=asc. Default: unsorted.'
	}
};

const config = {
	title: 'Atlanta Region Eviction API',
	description: `Based on the GET principle, the Atlanta Region Eviction API returns eviction data on individual cases, filings by building, daily filings by census tract, monthly filings by census tract, weekly filings by county and monthly filings by county. The API provides a set of endpoints, each with it's own path.`,
	baseURL: 'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest',
	endpointData: [
		{
			title: 'Daily Filings By Census Tract',
			endpoint: '/tractdaily',
			description: 'GET daily eviction data by census tract.',
			apiCall:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/tractdaily',
			tableData: [
				{
					param: 'FilingDate',
					permission: 'Optional',
					description:
						'A specific date, multiple dates or range of dates in the MM/DD/YYYY format (e.g.: FilingDate=01/01/2022, FilingDate=01/01/2022&FilingDate=02/01/2022 or FilingDate=01/01/2022-01/31/2022).'
				},
				{
					param: 'Year',
					permission: 'Optional',
					description:
						'A specific year in the YYYY format (e.g.: Year=2022). Cannot be combined with a FilingDate parameter or be a range of years.'
				},
				{
					param: 'TractID',
					permission: 'Optional',
					description: 'A specific census tract ID.'
				},
				{
					param: 'CountyID',
					permission: 'Optional',
					description:
						'The last three digits of a county FIPS code (e.g., CountyID=121 will query Fulton County).'
				},
				globalTableData.sort,
				globalTableData.type
			],
			sampleRequest:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/tractdaily?Year=2021&sort=asc'
		},
		{
			title: 'Monthly Filings By Census Tract',
			endpoint: '/tractbymonth',
			description: 'GET monthly eviction data by census tract.',
			apiCall:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/tractbymonth',
			tableData: [
				{
					param: 'TractID',
					permission: 'Optional',
					description: 'A specific census tract ID.'
				},
				{
					param: 'CountyID',
					permission: 'Optional',
					description:
						'The last three digits of a county FIPS code (e.g., CountyID=121 will query Fulton County).'
				},
				globalTableData.type
			],
			sampleRequest:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/tractbymonth?CountyID=089&type=csv'
		},
		{
			title: 'Weekly Filings By County',
			endpoint: '/countyweekly',
			description: 'GET weekly eviction data by county.',
			apiCall:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/countyweekly',
			tableData: [
				{
					param: 'FilingWeek',
					permission: 'Optional',
					description:
						'A date that represents the start of a specific week in the MM/DD/YYYY format. Can also be multiple dates or a range of dates (e.g.: FilingWeek=01/02/2022, FilingWeek=01/02/2022&FilingWeek=01/09/2022 or FilingWeek=01/02/2022-01/16/2022).'
				},
				{
					param: 'Year',
					permission: 'Optional',
					description:
						'A specific year in the YYYY format (e.g.: Year=2021). Cannot be combined with a FilingWeek query or be a range of years.'
				},
				{
					param: 'CountyID',
					permission: 'Optional',
					description:
						'The last three digits of a county FIPS code (e.g., CountyID=121 will query Fulton County).'
				},
				globalTableData.sort,
				globalTableData.type
			],
			sampleRequest:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/countyweekly?CountyID=135&FilingWeek=01/02/2022-01/30/2022&sort=asc'
		},
		{
			title: 'Monthly Filings By County',
			endpoint: '/countymonthly',
			description: 'GET monthly eviction data by county.',
			apiCall:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/countymonthly',
			tableData: [
				{
					param: 'FilingMonth',
					permission: 'Optional',
					description:
						'A date that represents the start of a specific month in the MM/DD/YYYY format (e.g., querying January 2022 would be FilingMonth=01/01/2022). Can also be multiple dates or a range of dates (e.g.: FilingMonth=01/01/2022&FilingMonth=02/01/2022 OR FilingMonth=01/01/2022-06/01/2022).'
				},
				{
					param: 'Year',
					permission: 'Optional',
					description:
						'A specific year in the YYYY format (e.g.: Year=2022). Cannot be combined with a FilingMonth query or be a range of years.'
				},
				{
					param: 'CountyID',
					permission: 'Optional',
					description:
						'The last three digits of a county FIPS code (e.g., county=121 will query Fulton County).'
				},
				globalTableData.sort,
				globalTableData.type
			],
			sampleRequest:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/countymonthly?Year=2021&sort=desc&type=csv'
		},
		{
			title: 'Filings By Building',
			endpoint: '/buildings',
			description: 'GET eviction data by building.',
			apiCall:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/buildings',
			tableData: [
				{
					param: 'city, zip',
					permission: 'Optional',
					description: 'A specific value (e.g.: city=atlanta or zip=30308).'
				},
				{
					param: 'county',
					permission: 'Optional',
					description:
						'The last three digits of a county FIPS code (e.g., county=135 will query Gwinnett County).'
				},
				{
					param: 'latitude, longitude',
					permission: 'Optional',
					description:
						'An exact latitude and/or longitude of a building (e.g.: latitude={some value}&longitude={some value}).'
				},
				{
					param: 'tractid',
					permission: 'Optional',
					description: 'A specific census tract ID.'
				},
				{
					param: 'blockgroupid',
					permission: 'Optional',
					description: 'A specific census block group ID.'
				},
				{
					param: 'street',
					permission: 'Optional',
					description:
						'A street address for the building (e.g., street=123%somewhere%dr).'
				},
				globalTableData.type
			],
			sampleRequest:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/buildings?city=atlanta'
		},
		{
			title: 'Individual Cases',
			endpoint: '/cases',
			description: 'GET case level data for the metro Atlanta area',
			apiCall:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/cases?apiKey={API Key}',
			tableData: [
				{
					param: 'apiKey',
					permission: 'Required',
					description:
						'Your unique API Key. If you do not have an API key please visit the Request API Key section below.'
				},
				{
					param: 'caseID',
					permission: 'Optional',
					description: 'A specific ID provided by the court for the case.'
				},
				{
					param: 'fileDate',
					permission: 'Optional',
					description:
						'A specific date, multiple dates or range of dates in the MM/DD/YYYY format (e.g.: fileDate=01/01/2022, fileDate=01/01/2022&fileDate=02/01/2022 or fileDate=01/01/2022-01/31/2022).'
				},
				{
					param: 'year',
					permission: 'Optional',
					description:
						'A specific year in the YYYY format (e.g.: year=2022). Cannot be combined with a fileDate parameter or be a range of years.'
				},
				{
					param: 'county',
					permission: 'Optional',
					description:
						'The last three digits of a county FIPS code (e.g., county=121 will query Fulton County)'
				},
				{
					param: 'tractID',
					permission: 'Optional',
					description: 'A specific census tract ID.'
				},
				{
					param: 'blockGroupID',
					permission: 'Optional',
					description: 'A specific census block group ID.'
				},
				{
					param: 'city, zip',
					permission: 'Optional',
					description: 'A specific value. (e.g.: city=ATLANTA, zip=12345).'
				},
				{
					param: 'street, address',
					permission: 'Optional',
					description:
						'A specific value. All spaces should be replaced with a "+" (e.g.: street=123+SOMETHING+ST+NE, address=123+SOMETHING+ST+NE,+ATLANTA,+GA+12345'
				},
				{
					param: 'longitude, latitude',
					permission: 'Optional',
					description: 'An exact latitude and/or longitude of a location (e.g.: latitude={some value}&longitude={some value}).'
				},
				{
					param: 'caseStatus',
					permission: 'Optional',
					description: 'The status of a case (e.g.: caseStatus=OPEN).'
				},
				{
					param:
						'plaintiffName, plaintiffStreetAddress, plaintiffCity, plaintiffAttorney',
					permission: 'Optional',
					description:
						'A specific value for a plaintiff. All spaces should be replaced with a "+" (e.g.: plaintiffName=SOME+VALUE)'
				},
				{
					param: 'answer, services, judgment, defaultJudgment, dismiss',
					permission: 'Optional',
					description:
						'A 1 or 0 that represents the status of the field (e.g.: answer=1 or answer=0). 1 = true and 0 = false. If dismiss=1 this will mean the case has been dismissed.'
				},
				globalTableData.sort,
				globalTableData.type
			],
			sampleRequest:
				'https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/cases?apiKey={API Key}&fileDate={File Date}&county={County Code}',
			requestKey:
				'To request an API Key, please contact Erik Woodworth at ewoodworth@atlantaregional.org.  Include "Eviction Data API Key Request" in the subject line and a brief explanation of your intended use(s) of the data in the body of the email.  All requests will require follow-up to provide additional details, and simply submitting a request does not insure a key will be granted.  Once your request has been vetted and approved, a Data Use Aggreement (DUA) will need to completed and signed before a key is issued.',
			note: 'Unless provided global access, your API Key will come with preset permissions limiting accessible records and/or fields. These permissions will serve as a base query and not allow documents and fields outside of the permissions to be queried. You may still narrow your search within your provided permissions by adding a query to your request.'
		}
	]
};

export default config;