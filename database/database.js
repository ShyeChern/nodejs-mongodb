const mongoose = require('mongoose');

// initialize database
module.exports.init = async () => {
	try {
		const database = await mongoose.connect(process.env.MONGODB_URL);
		console.log('Connected to database');
		return database;
	} catch (e) {
		console.log('Fail to connect database. ' + e.message);
	}
};

// for transaction query
module.exports.conn = mongoose.createConnection(process.env.MONGODB_URL);
