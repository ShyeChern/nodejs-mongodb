const productModel = require('./products.model');
const { conn } = require('../../../database/database');
const mongoose = require('mongoose');

module.exports.addProduct = async (req, res, next) => {
	try {
		let product;

		await conn.transaction(async (session) => {
			// remove duplicate product
			await productModel.findOneAndUpdate(
				{ _id: mongoose.Types.ObjectId(req.params.productId) },
				{ $pull: { items: { name: req.body.name } } },
				{ session }
			);
			product = await productModel.findOneAndUpdate(
				{ _id: mongoose.Types.ObjectId(req.params.productId) },
				{
					$push: {
						items: {
							name: req.body.name,
							quantity: req.body.quantity,
							price: Math.floor(Math.random() * 10) + 1,
						},
					},
				},
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
			{ _id: mongoose.Types.ObjectId(req.params.productId) },
			{ $pull: { items: { name: req.body.name } } },
			{ new: true }
		);

		res.send({ product });
	} catch (err) {
		return next(err);
	}
};

module.exports.summary = async (req, res, next) => {
	try {
		const result = await productModel.aggregate([
			{
				$group: {
					_id: null,
					totalProductsWithItem1: {
						$sum: {
							$size: {
								$filter: { input: '$items', as: 'item', cond: { $eq: ['$$item.name', 'item1'] } },
							},
						},
					},
					productsWithMoreThanOneItem: {
						$sum: {
							$cond: { if: { $gt: [{ $size: '$items' }, 1] }, then: 1, else: 0 },
						},
					},
				},
			},
		]);

		res.send(result);
	} catch (err) {
		return next(err);
	}
};
