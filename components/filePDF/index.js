const System = require('systemic');

const filePDF = require('./filePDF');

module.exports = new System({ name: 'filePDF' })
  .add('filePDF', filePDF())
  .dependsOn('logger');
