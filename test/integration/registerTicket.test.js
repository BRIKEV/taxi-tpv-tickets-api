const path = require('path');
const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');
const fileMock = require('../mocks/fileMock');
const getAuthToken = require('../mocks/getAuthToken');

describe('Register ticket', () => {
	let request;
	let sys = system();
	sys = sys.set('filePDF', fileMock()).dependsOn();

	let ticket;
	let usersCollection;
	let appConfig;
	before(async () => {
		const {
			app, mongo, store, config,
		} = await sys.start();
		appConfig = config;
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

	it('should return 404 when there is no ticket', () => request
		.post('/api/v1/tickets')
		.set('Authorization', jwt)
		.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
		.expect(200)
		.then(() => request.post('/api/v1/tickets/register')
			.set('Authorization', jwt)
			.send({
				date: '13-12-2019',
				price: '9999,6',
			})
			.expect(200))
		.then(async () => {
			const result = await ticket.find({}).toArray();
			expect(result).to.have.length(5);
			const newTicket = await ticket.findOne({
				formattedDate: '13-12-2019',
				price: '9999,6',
			});
			expect(newTicket.validated).to.eql(false);
			expect(newTicket.pdfName).to.eql(appConfig.controller.registerPdfName);
		}));

	it('should register a ticket after calling POST /api/v1/tickets', () => request
		.post('/api/v1/tickets')
		.set('Authorization', jwt)
		.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
		.expect(200)
		.then(() => request.post('/api/v1/tickets/register')
			.set('Authorization', jwt)
			.send({
				date: '13-12-2019',
				price: '2,6',
			})
			.expect(200))
		.then(async ({ body }) => {
			expect(body.success).to.eql(true);
			const { validated } = await ticket.findOne({
				formattedDate: '13-12-2019',
				price: '2,6',
			});
			expect(validated).to.eql(true);
		}));
});
