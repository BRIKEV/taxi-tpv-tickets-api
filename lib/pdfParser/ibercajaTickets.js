const pdf = require('pdf-parse');

const SPLIT_CONDITION = 'VENTA';
const regexPattern = /([0-9]{2}-[0-9]{2}-[0-9]{4})%%([0-9]{2}:[0-9]{2})%%.{30}%%([0-9]{1,3},[0-9]{2})/;
// default render callback
const renderPage = pageData => {
	// check documents https://mozilla.github.io/pdf.js/
	const renderOptions = {
		// replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
		normalizeWhitespace: false,
		// do not attempt to combine same line TextItem's. The default value is `false`.
		disableCombineTextItems: false,
	};

	return pageData.getTextContent(renderOptions)
		.then(textContent => {
			let lastY = '';
			let text = [];
			for (const item of textContent.items) { // eslint-disable-line
				if (lastY == item.transform[5] || !lastY) {  // eslint-disable-line
					text = [...text];
				} else if (item.str.includes(SPLIT_CONDITION)) {
					const parserTable = item.str.split(' ').filter(splitItem => splitItem).join('%%');
					const [, formattedDate, hour, price] = parserTable.match(regexPattern);
					if (!!formattedDate || !!hour || !!price) {
						text = [
							...text,
							{ formattedDate, hour, price },
						];
					}
				}
				lastY = item.transform[5]; // eslint-disable-line
			}
			return JSON.stringify(text).trim();
		});
};

module.exports = (buffer, name) => pdf(buffer, {
	pagerender: renderPage,
}).then(data => {
	const parsedData = data.text.split('\n\n')
		.filter(Boolean)
		.map(elem => JSON.parse(elem));
	return {
		name,
		data: [].concat(...parsedData),
	};
});
