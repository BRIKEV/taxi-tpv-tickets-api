module.exports = {
	server: {
		host: '0.0.0.0',
		port: process.env.PORT || 4000,
	},
	controller: {
		tokenSecret: process.env.TOKEN_SECRET,
	},
	store: {
		cryptoSecret: process.env.CRYPTO_SECRET,
		cryptoAlgorithm: process.env.CRYPTO_ALGORITHM,
	},
	routes: {
		admin: {
			whitelist: [process.env.APP_HOST],
			swaggerOptions: {
				swaggerDefinition: {
					info: {
						description: 'Documentation for taxi-tpv-tickets-api',
						title: 'taxi-tpv-tickets-api',
						version: '1.0.0',
					},
					host: process.env.DOCS_HOST || 'localhost:4000',
					basePath: '/',
					produces: ['application/json'],
					schemes: ['https', 'http'],
					securityDefinitions: {
						JWT: {
							type: 'apiKey',
							in: 'header',
							name: 'Authorization',
							description: '',
						},
					},
				},
				basedir: process.cwd(), // app absolute path
				files: ['./**/**-routes.js'], // path to the API handle folder, related to basedir
				route: {
					url: '/api-docs',
					docs: '/api-docs.json',
				},
			},
		},
	},
	mongo: {
		connectionString: process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/tpv-tickets',
		contentDatabaseName: process.env.DATABASE_NAME || 'tpv-tickets',
	},
	logger: {
		transport: 'console',
		include: [
			'tracer',
			'timestamp',
			'level',
			'message',
			'error.message',
			'error.code',
			'error.stack',
			'request.url',
			'request.headers',
			'request.params',
			'request.method',
			'response.statusCode',
			'response.headers',
			'response.time',
			'process',
			'system',
			'package.name',
			'service',
		],
		exclude: ['password', 'secret', 'token', 'request.headers.cookie', 'dependencies', 'devDependencies'],
	},
};
