const { UserError } = require('../../util/error');
const userModel = require('./users.model');
const productModel = require('../products/products.model');
const { conn } = require('../../../database/database');

module.exports.getUser = async (req, res, next) => {
	try {
		const find = req.query.username ? { username: req.query.username } : {};
		const skip = req.query.skip ? parseInt(req.query.skip) : '';
		const limit = req.query.limit ? parseInt(req.query.limit) : '';

		const users = await userModel
			.find(find)
			.select('-__v')
			.populate('products', 'products')
			.skip(skip)
			.limit(limit)
			.lean();
		const allDocuments = await userModel.estimatedDocumentCount();

		res.send({ users, allDocuments });
	} catch (err) {
		return next(err);
	}
};

module.exports.addUser = async (req, res, next) => {
	try {
		const exist = await userModel.exists({ username: req.body.username });
		if (exist) {
			throw new UserError(UserError.USERNAME_EXIST);
		}

		await conn.transaction(async (session) => {
			const newProduct = new productModel({});
			const product = await newProduct.save({ session });
			const newUser = new userModel({ username: req.body.username, products: product._id });
			await newUser.save({ session });
		});

		// same data with above transaction
		const [user, userPopulateProduct] = await userModel.findUserDetail({
			username: req.body.username,
		});

		res.send({ user, userPopulateProduct });
	} catch (err) {
		return next(err);
	}
};
