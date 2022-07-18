const pdf = require('pdf-parse');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
require('dayjs/locale/es');

dayjs.extend(customParseFormat);

const SPLIT_CONDITION = 'VENTA';
// REGEX to get the current date to parse the name of the file
const pdfDates = /\s([0-9]{2}-[0-9]{2}-[0-9]{4})\sAL\s([0-9]{2}-[0-9]{2}-[0-9]{4})/;
// Regex to get all the prices in the PDF
const allPricesPattern = /([0-9]{2}-[0-9]{2}-[0-9]{4})%%([0-9]{2}:[0-9]{2})%%.{30}%%([0-9]{1,3},[0-9]{2})/;
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
      let pdfName = '';
			for (const item of textContent.items) { // eslint-disable-line
				if (lastY == item.transform[5] || !lastY) {  // eslint-disable-line
          text = [...text];
        } else if (item.str.includes(' AL ')) {
          const [,, end] = item.str.match(pdfDates);
          const formattedEndDate = dayjs(end, 'DD-MM-YYYY').add(1, 'day').locale('es').format('DD-MMM.-YYYY');
          pdfName = `${formattedEndDate}_Extractodecomercio.pdf`;
        } else if (item.str.includes(SPLIT_CONDITION)) {
          const parserTable = item.str.split(' ').filter(splitItem => splitItem).join('%%');
          const [, formattedDate, hour, price] = parserTable.match(allPricesPattern);
          if (!!formattedDate || !!hour || !!price) {
            text = [
              ...text,
              { formattedDate, hour, price },
            ];
          }
        }
				lastY = item.transform[5]; // eslint-disable-line
      }
      return JSON.stringify([pdfName, ...text]).trim();
    });
};

module.exports = buffer => pdf(buffer, {
  pagerender: renderPage,
}).then(data => {
  const parsedData = data.text.split('\n\n')
    .filter(Boolean)
    .map(elem => JSON.parse(elem));
  const dataParsed = [].concat(...parsedData);
  const tickets = dataParsed.filter(info => !!info.formattedDate);
  const titles = dataParsed.filter(info => !info.formattedDate);
  return {
    data: tickets,
    name: titles[0],
  };
});
