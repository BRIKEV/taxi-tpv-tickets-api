const {
	handleHttpError,
	tagError,
	errorFactory,
	CustomErrorTypes,
} = require('error-handler-module');

const { isValidPrice, isValidFormatDate } = require('../../lib/validator');

const wrongInput = errorFactory(CustomErrorTypes.WRONG_INPUT);

module.exports = () => {
	const start = async ({ app, controller, logger }) => {
		const authMiddleware = (req, res, next) => {
			const { authorization } = req.headers;
			try {
				controller.isVerified(authorization);
				return next();
			} catch (error) {
				return next(tagError(error));
			}
		};
		/**
		 * POST /api/v1/tickets
		 * @summary This endpoint allows you to save tickets by uploading pdf files
		 * @tags Tickets - Everything about tickets
		 * @param {File} request.body.required - PDF files payload - multipart/form-data
		 * @return {SuccessPDFResponse} 200 - Successful operation
		 * @return {Error} default - Error message
		 * @security JWT
		*/
		app.post('/api/v1/tickets', authMiddleware, async (req, res, next) => {
			try {
				const { file } = req.files;
				const processedInfo = await controller.savePDFInfo(file);
				const response = { success: true, processedInfo };
				return res.json(response);
			} catch (error) {
				return next(tagError(error));
			}
		});

		/**
		 * GET /api/v1/tickets
		 * @summary This endpoint allows you retrieve tickets list
		 * @tags Tickets - Everything about tickets
		 * @return {Array.<TicketsResponse>} 200 - Successful operation
		 * @return {Error} default - Error message
		 * @security JWT
		*/
		app.get('/api/v1/tickets', authMiddleware, async (req, res, next) => {
			try {
				const tickets = await controller.getTickets();
				return res.json(tickets);
			} catch (error) {
				return next(tagError(error));
			}
		});

		/**
		 * POST /api/v1/tickets/register
		 * @summary This endpoint allows you to register one ticket in the system
		 * @tags Tickets - Everything about tickets
		 * @param {RegisterTicketRequest} request.body.required
		 * @return {SuccessTicketRegistered} 200 - Successful operation
		 * @return {Error} default - Error message
		 * @security JWT
		*/
		app.post('/api/v1/tickets/register', authMiddleware, async (req, res, next) => {
			try {
				const { date, price } = req.body;
				if (!date || !price) {
					throw wrongInput('You must provide date and price');
				}
				if (!isValidPrice(price)) {
					throw wrongInput('You must provide a valid price');
				}
				if (!isValidFormatDate(date)) {
					throw wrongInput('You must provide a valid date');
				}
				await controller.registerTicket(date, price);
				return res.json({ success: true });
			} catch (error) {
				return next(tagError(error));
			}
		});

		/**
		 * POST /api/v1/login
		 * @summary This endpoint allows you to login to the API
		 * @tags User - Everything about user
		 * @param {LoginRequest} request.body.required
		 * @return {LoginResponse} 200 - Successful operation
		 * @return {Error} default - Error message
		*/
		app.post('/api/v1/login', async (req, res, next) => {
			try {
				const { email, password } = req.body;
				if (!email && !password) {
					throw wrongInput('You must provide email and password');
				}
				const loginInfo = await controller.login(email, password);
				return res.json(loginInfo);
			} catch (error) {
				return next(tagError(error));
			}
		});

		/**
		 * DELETE /api/v1/tickets/:id
		 * @summary This endpoint delete one ticket
		 * @tags Tickets - Everything about tickets
		 * @param {string} id.path.required
		 * @return {TicketsResponse} 200 - Successful operation
		 * @return {Error} default - Error message
		 * @security JWT
		*/
		app.delete('/api/v1/tickets/:id', authMiddleware, async (req, res, next) => {
			try {
				const ticket = await controller.deleteTicket(req.params.id);
				return res.json(ticket);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.use(handleHttpError(logger));
		return Promise.resolve();
	};

	return { start };
};
