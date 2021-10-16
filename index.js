require('dotenv').config();
require('./database/database').init();
const express = require('express');
const cors = require('cors');
const https = require('https');
const helmet = require('helmet');
const fs = require('fs');
const PORT = process.env.PORT || 5000;
const app = express();
const { setRoutes } = require('./src/routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
setRoutes(app);

if (process.env.NODE_ENV === 'production') {
	const options = {
		key: fs.readFileSync(process.env.SSL_KEY),
		cert: fs.readFileSync(process.env.SSL_CERT),
	};

	https.createServer(options, app).listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
} else {
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
}
