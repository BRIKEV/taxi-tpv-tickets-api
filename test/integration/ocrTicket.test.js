const path = require('path');
const expect = require('expect.js');
const supertest = require('supertest');
const { assert } = require('sinon');

const system = require('../../system');
const fileMock = require('../mocks/fileMock');
const ocrMock = require('../mocks/ocrMock');
const getAuthToken = require('../mocks/getAuthToken');

describe('OCR tickets endpoints', () => {
  let request;
  let ocrSystem;
  let sys = system();
  sys = sys.set('filePDF', fileMock()).dependsOn();
  sys = sys.set('ocr', ocrMock()).dependsOn();

  let ticket;
  let jwt;
  let usersCollection;
  before(async () => {
    const {
      app, mongo, store, ocr,
    } = await sys.start();
    request = supertest(app);
    ticket = mongo.collection('tickets');
    usersCollection = mongo.collection('users');
    const userToken = await getAuthToken(request, store);
    jwt = userToken;
    ocrSystem = ocr;
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

  it('should return 400 if there is no file', () => request
    .post('/api/v1/ticket/ocr')
    .set('Authorization', jwt)
    .expect(400));

  it('should return 400 if there is no ticket file', () => request
    .post('/api/v1/ticket/ocr')
    .set('Authorization', jwt)
    .attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
    .expect(400));

  it('should return 200 and validate one ticket already registered', () => request.post('/api/v1/ticket/ocr')
    .set('Authorization', jwt)
    .attach('ticket', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
    .expect(200)
    .then(({ body }) => {
      expect(body.date).to.eql('15-03-2020');
      expect(body.price).to.eql('55,60');
      assert.calledOnce(ocrSystem.textDetection);
    }));
});
