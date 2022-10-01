const express = require('express');
const router = express.Router();
const { UserError, ErrorMessage } = require('../src/util/error');
const users = require('./v1/users/users.controller');
const products = require('./v1/products/products.controller');

router.route('/users').get(users.getUser);
router.route('/users').post(users.addUser);
router.route('/users/:username').delete(users.deleteUser);
router.route('/products/:productId/add').put(products.addProduct);
router.route('/products/:productId/remove').put(products.removeProduct);

module.exports.setRoutes = (app) => {
	app.use('/api/v1', router);

	app.use('/*', (req, res, next) => {
		next(new UserError(404, 404));
	});

	// error middleware
	app.use((err, req, res, next) => {
		if (process.env.NODE_ENV !== 'production') {
			console.log(err);
		}
		if (err instanceof UserError) {
			res.status(err.statusCode).send({ message: err.message });
		} else {
			let message = `${ErrorMessage[500]}`;
			res.status(500).send({ message });
		}
	});
};
