
const pdfDataMock = require('../fixtures/pdfDataMock.json');

module.exports = () => {
  const start = async () => {
    const pdfParser = () => async file => {
      if (!file) throw new Error('Your test is worng as you do not send file');
      return {
        name: '24-dic.-2019_Extractodecomercio.pdf',
        data: pdfDataMock,
      };
    };
    return Promise.resolve({
      pdfParser,
    });
  };

  return { start };
};
