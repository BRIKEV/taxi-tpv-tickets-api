const { errorFactory, CustomErrorTypes } = require('error-handler-module');
const validator = require('swagger-endpoint-validator');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const unauthorizedError = errorFactory(CustomErrorTypes.UNAUTHORIZED);

module.exports = () => {
	const start = async ({ manifest = {}, app, config }) => {
		const { swaggerOptions } = config;

		const { whitelist } = config;
		const corsOptions = {
			origin: (origin, callback) => {
				if (whitelist.indexOf(origin) !== -1) {
					return callback(null, true);
				}
				return callback(unauthorizedError('Not allowed by CORS'));
			},
		};
		app.use(cors(corsOptions));
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.use(fileUpload());

		validator.init(app, swaggerOptions);

		/**
		 * This endpoint serves the manifest
		 * @route GET /__/manifest
		 * @group Admin - Everything about admin routes
		 * @returns 200 - Sucessful response
		*/
		app.get('/__/manifest', (req, res) => res.json(manifest));

		return Promise.resolve();
	};

	return { start };
};
