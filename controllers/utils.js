const hexGen = require('hex-generator');

module.exports = {
	handleResLog: ({ status, numDocs, url, errMessage }) => {
		let logStr = `status: ${status}, numDocs: ${numDocs}, URL: ${url}`;

		if (errMessage) logStr += `, ${errMessage}`;

		return console.log(`\n${logStr}\n`);
	},
	sortByDate: (a, b, dateField) => {
		const dateA = new Date(a[dateField]).getTime();
		const dateB = new Date(b[dateField]).getTime();
		return dateA > dateB ? 1 : -1;
	},
	createHex: async () => {
		const hexArr = [];
		const totalBits = 128;
		const sections = 4;

		for (let index = 1; index <= sections; index++) {
			hexArr.push(hexGen(totalBits / sections));
		}

		return hexArr.join('-');
	}
};
