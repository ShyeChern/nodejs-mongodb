const productModel = require('./products.model');
const { conn } = require('../../../database/database');
const mongoose = require('mongoose');

module.exports.addProduct = async (req, res, next) => {
	try {
		let product;

		await conn.transaction(async (session) => {
			// remove duplicate product
			await productModel.findOneAndUpdate(
				{ _id: mongoose.Types.ObjectId(req.body.productId) },
				{ $pull: { products: { name: req.body.name } } },
				{ session }
			);
			product = await productModel.findOneAndUpdate(
				{ _id: mongoose.Types.ObjectId(req.body.productId) },
				{ $push: { products: { name: req.body.name, quantity: req.body.quantity } } },
				{ new: true, session }
			);
		});

		res.send({ product });
	} catch (err) {
		return next(err);
	}
};

module.exports.removeProduct = async (req, res, next) => {
	try {
		let product = await productModel.findOneAndUpdate(
			{ _id: mongoose.Types.ObjectId(req.body.productId) },
			{ $pull: { products: { name: req.body.name } } },
			{ new: true }
		);

		res.send({ product });
	} catch (err) {
		return next(err);
	}
};
