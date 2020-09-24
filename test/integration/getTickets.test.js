const path = require('path');
const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');
const fileMock = require('../mocks/fileMock');
const getAuthToken = require('../mocks/getAuthToken');

describe('GET endpoints', () => {
  let request;
  let sys = system();
  sys = sys.set('filePDF', fileMock()).dependsOn();

  let ticket;
  let jwt;
  let usersCollection;
  before(async () => {
    const { app, mongo, store } = await sys.start();
    request = supertest(app);
    ticket = mongo.collection('tickets');
    usersCollection = mongo.collection('users');
    const userToken = await getAuthToken(request, store);
    jwt = userToken;
  });

  beforeEach(async () => {
    await ticket.deleteMany({});
    await usersCollection.deleteMany({});
  });

  afterEach(async () => {
    await ticket.deleteMany({});
    await usersCollection.deleteMany({});
  });

  after(() => sys.stop());

  it('should retrieve a list of tickets when we called GET /api/v1/tickets', () => request
    .post('/api/v1/tickets')
    .set('Authorization', jwt)
    .attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
    .expect(200)
    .then(() => request.get('/api/v1/tickets')
      .set('Authorization', jwt)
      .expect(200))
    .then(({ body: tickets }) => {
      tickets.forEach(ticketItem => {
        expect(ticketItem).to.have.property('id');
        expect(ticketItem).to.have.property('validated');
        expect(ticketItem.validated).to.eql(false);
        expect(ticketItem).to.have.property('pdfName');
        expect(ticketItem.pdfName).to.eql('file-mock.txt');
        expect(ticketItem).to.have.property('price');
        expect(ticketItem).to.have.property('hour');
        expect(ticketItem).to.have.property('formattedDate');
      });
    }));
});
