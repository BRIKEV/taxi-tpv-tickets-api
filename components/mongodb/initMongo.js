const { MongoClient } = require('mongodb');

module.exports = () => {
  let client;
  const start = async ({ config, logger }) => {
    const { connectionString, contentDatabaseName } = config;
    try {
      logger.info(`Connecting to ${!connectionString ? 'undefined' : connectionString.split('@')[1]}`);
      client = await MongoClient.connect(
        connectionString,
        { useUnifiedTopology: true },
      );
      const db = client.db(contentDatabaseName);

      return db;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  };

  return { start };
};
