require('dotenv').config();
const System = require('systemic');
const { join } = require('path');

module.exports = () => new System({ name: 'taxi-tpv-tickets-api' })
  .bootstrap(join(__dirname, 'components'));
