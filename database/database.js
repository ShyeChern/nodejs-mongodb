const mongoose = require('mongoose');

// initialize database
module.exports.init = () => {
	mongoose.connect(process.env.MONGODB_URL, (err) => {
		if (err) {
			console.log('Fail to connect database. ' + err.message);
			return;
		}
		console.log('Connected to database');
	});
};

// db connection - for transaction query
module.exports.conn = mongoose.createConnection(process.env.MONGODB_URL);
