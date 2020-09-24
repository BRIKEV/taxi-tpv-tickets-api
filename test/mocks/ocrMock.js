const { spy } = require('sinon');

const orcResult = require('../fixtures/orcResult.json');

module.exports = () => {
  const start = async () => {
    const textDetection = () => Promise.resolve(orcResult);

    return {
      textDetection: spy(textDetection),
    };
  };

  return { start };
};
