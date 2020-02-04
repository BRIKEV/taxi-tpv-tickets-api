const path = require('path');
const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');
const fileMock = require('../mocks/fileMock');
const getAuthToken = require('../mocks/getAuthToken');

describe('Upload endpoints', () => {
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

	it('should save pdf mocked data in mongodb', () => request
		.post('/api/v1/tickets')
		.set('Authorization', jwt)
		.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
		.expect(200)
		.then(async response => {
			expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
			const tickets = await ticket.find({}).toArray();
			tickets.forEach(ticketItem => {
				expect(ticketItem).to.have.property('validated');
				expect(ticketItem.validated).to.eql(false);
				expect(ticketItem).to.have.property('pdfName');
				expect(ticketItem.pdfName).to.eql('file-mock.txt');
				expect(ticketItem).to.have.property('price');
				expect(ticketItem).to.have.property('hour');
				expect(ticketItem).to.have.property('formattedDate');
			});
		}));

	it('should return 400 if pdf was already recorded', () => request
		.post('/api/v1/tickets')
		.set('Authorization', jwt)
		.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
		.expect(200)
		.then(() => request
			.post('/api/v1/tickets')
			.set('Authorization', jwt)
			.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
			.expect(400)));

	it('should return 200 and validate one ticket already registered', () => request.post('/api/v1/tickets/register')
		.set('Authorization', jwt)
		.send({
			date: '13-12-2019',
			price: '2,6',
		})
		.expect(200)
		.then(() => request
			.post('/api/v1/tickets')
			.set('Authorization', jwt)
			.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
			.expect(200)
			.then(async response => {
				expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
				const tickets = await ticket.find({}).toArray();
				expect(tickets).to.have.length(4);
				const validatedTickets = tickets.filter(({ validated }) => validated);
				expect(validatedTickets).to.have.length(1);
				expect(validatedTickets[0].pdfName).to.eql('file-mock.txt');
				expect(validatedTickets[0]).to.have.property('hour');
			})));
});
