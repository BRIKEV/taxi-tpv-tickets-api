module.exports = {
	server: {
		host: '0.0.0.0',
		port: process.env.PORT || 4000,
	},
	controller: {
		tokenSecret: process.env.TOKEN_SECRET,
		registerPdfName: 'Tickets sin pdf',
	},
	store: {
		cryptoSecret: process.env.CRYPTO_SECRET,
		cryptoAlgorithm: process.env.CRYPTO_ALGORITHM,
	},
	routes: {
		admin: {
			whitelist: [process.env.APP_HOST, `https://${process.env.DOCS_HOST}`],
			swaggerOptions: {
				info: {
					description: 'Documentation for taxi-tpv-tickets-api',
					title: 'taxi-tpv-tickets-api',
					version: '1.0.0',
					contact: {
						name: 'Brikev',
						email: 'hello.brikev@gmail.com',
					},
				},
				servers: [],
				security: {
					JWT: {
						type: 'apiKey',
						in: 'header',
						name: 'Authorization',
					},
				},
				baseDir: process.cwd(),
				swaggerUIPath: '/docs/api',
				filesPattern: './**/**-routes.js',
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
