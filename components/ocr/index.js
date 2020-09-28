const System = require('systemic');

const controller = require('./initOCR');

module.exports = new System({ name: 'ocr' })
  .add('ocr', controller());
