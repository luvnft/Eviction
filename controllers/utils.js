const hexGen = require('hex-generator');

module.exports = {
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
