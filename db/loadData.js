const debug = require('debug')('taxi-tpv:loadData');
const system = require('../system');

const sys = system();

const user = {
  email: process.env.LOAD_USER_EMAIL,
  password: process.env.LOAD_USER_PASSWORD,
};

(async () => {
  if (!user.email && !user.password) {
    throw new Error('No user and password provided');
  }
  const { store, mongo } = await sys.start();
  const usersCollection = mongo.collection('users');
  store.registerUser(user);
  const userDB = await usersCollection.findOne({ email: user.email });
  if (!userDB) {
    debug('It was not saved');
    throw new Error('User was not saved');
  }
  debug('Data was saved');
  process.exit(0);
})();
