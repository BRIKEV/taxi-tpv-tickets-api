
const pdfParser = require('../../lib/pdfParser');

module.exports = () => {
  const start = async () => (
    Promise.resolve({
      pdfParser,
    })
  );

  return { start };
};
