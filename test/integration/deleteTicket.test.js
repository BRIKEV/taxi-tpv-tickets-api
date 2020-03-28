const path = require('path');
const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');
const fileMock = require('../mocks/fileMock');
const getAuthToken = require('../mocks/getAuthToken');

describe('DELETE endpoint', () => {
	let request;
	let sys = system();
	sys = sys.set('filePDF', fileMock()).dependsOn();

	let ticket;
	let jwt;
	before(async () => {
		const { app, mongo, store } = await sys.start();
		request = supertest(app);
		ticket = mongo.collection('tickets');
		const userToken = await getAuthToken(request, store);
		jwt = userToken;
	});

	beforeEach(async () => {
		await ticket.deleteMany({});
	});

	afterEach(async () => {
		await ticket.deleteMany({});
	});

	after(() => sys.stop());

	it('Should be return not found when id is incorrect', () => request
		.delete('/api/v1/tickets/5e7e958716d8e31c269706c7')
		.set('Authorization', jwt)
		.expect(404));

	it('Shoulb be return a deleted ticket', () => {
		let expectedTicket;
		let expectedTickets;
		return request
			.post('/api/v1/tickets')
			.set('Authorization', jwt)
			.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
			.expect(200)
			.then(async () => {
				expectedTicket = await ticket.findOne({});
				expectedTickets = await ticket.find({}).toArray();
				expectedTicket = JSON.parse(JSON.stringify(expectedTicket));
				return request.delete(`/api/v1/tickets/${expectedTicket._id}`)
					.set('Authorization', jwt)
					.expect(200);
			})
			.then(async ({ body }) => {
				expect(body).to.eql({
					id: expectedTicket._id,
					formattedDate: expectedTicket.formattedDate,
					pdfName: expectedTicket.pdfName,
					price: expectedTicket.price,
					validated: expectedTicket.validated,
					date: expectedTicket.date,
				});
				const tickets = await ticket.find({}).toArray();
				expect(tickets).to.have.length(expectedTickets.length - 1);
			});
	});
});
