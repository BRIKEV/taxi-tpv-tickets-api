const System = require('systemic');
const initPg = require('./initMongo');

module.exports = new System({ name: 'mongo' })
  .add('mongo', initPg({ configPath: 'connection' }))
  .dependsOn('config', 'logger');
