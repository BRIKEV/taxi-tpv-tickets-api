const { errorFactory, CustomErrorTypes } = require('error-handler-module');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const unauthorizedError = errorFactory(CustomErrorTypes.UNAUTHORIZED);

module.exports = () => {
	const start = async ({
		manifest = {}, app, config, logger,
	}) => {
		const { swaggerOptions } = config;

		const { whitelist } = config;
		const corsOptions = {
			origin: (origin, callback) => {
				if (whitelist.indexOf(origin) !== -1 || !origin) {
					return callback(null, true);
				}
				logger.error(`CORS error for this origin ${origin}`);
				return callback(unauthorizedError('Not allowed by CORS'));
			},
		};
		app.use(cors(corsOptions));
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.use(fileUpload());

		expressJSDocSwagger(app)(swaggerOptions);

		/**
		 * GET /__/manifest
		 * @summary This endpoint serves the manifest
		 * @tags Admin - Everything about admin routes
		 * @return {object} 200 - Sucessful response
		*/
		app.get('/__/manifest', (req, res) => res.json(manifest));

		return Promise.resolve();
	};

	return { start };
};
