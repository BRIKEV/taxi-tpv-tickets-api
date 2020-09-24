const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');

describe('Login endpoints', () => {
  let request;
  const sys = system();

  let registerUser;
  let usersCollection;
  before(async () => {
    const { app, store, mongo } = await sys.start();
    request = supertest(app);
    registerUser = store.registerUser;
    usersCollection = mongo.collection('users');
  });

  beforeEach(async () => {
    await usersCollection.deleteMany({});
  });

  afterEach(async () => {
    await usersCollection.deleteMany({});
  });

  after(() => sys.stop());

  it('should throw error 400 when pws and email is not sent', () => request
    .post('/api/v1/login')
    .send({})
    .expect(400));

  it('should throw error 403 when pws or email not exists', () => request
    .post('/api/v1/login')
    .send({
      email: 'noemailregistered@gmail.com',
      password: '12344',
    })
    .expect(403));

  it('should throw error 400 when pws and user is not sent', () => {
    const user = { email: 'kevin@test.com', password: 'secretpassword' };
    return registerUser(user)
      .then(async () => {
        const users = await usersCollection.find().toArray();
        expect(users).to.have.length(1);
        return request
          .post('/api/v1/login')
          .send(user)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body).to.only.have.keys('email', 'jwt');
        expect(body.email).to.eql(user.email);
      });
  });
});
