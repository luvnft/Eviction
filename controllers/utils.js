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
	}
};
