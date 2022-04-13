module.exports = {
	cases: {
		flattenConfig: {
			plaintiff: {
				type: 'setKeys',
				flatKeys: [
					{ dbKey: 'name', csvKey: 'plaintiffName' },
					{ dbKey: 'streetAddress', csvKey: 'plaintiffStreetAddress' },
					{ dbKey: 'city', csvKey: 'plaintiffCity' },
					{ dbKey: 'phone', csvKey: 'plaintiffPhone' },
					{ dbKey: 'attorney', csvKey: 'plaintiffAttorney' }
				]
			}
		}
	},
	filingsByTractMonth: {
		flattenConfig: {
			FilingsByMonth: {
				type: 'dateRange',
				startDate: '01/01/2020',
				endDate: new Date(),
				flatKeys: [
					{ dbKey: 'During the Pandemic', csvKey: 'During the Pandemic' }
				]
			}
		}
	}
};
