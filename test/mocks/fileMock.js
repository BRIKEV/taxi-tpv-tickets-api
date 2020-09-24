
const pdfDataMock = require('../fixtures/pdfDataMock.json');

module.exports = () => {
  const start = async () => {
    const pdfParser = () => async (file, name) => {
      if (!file) throw new Error('Your test is worng as you do not send file');
      return {
        name,
        data: pdfDataMock,
      };
    };
    return Promise.resolve({
      pdfParser,
    });
  };

  return { start };
};
