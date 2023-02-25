const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		items: {
			type: [
				{
					name: {
						type: String,
						required: true,
						trim: true,
					},
					quantity: {
						type: Number,
						required: true,
						min: 1,
					},
					price: {
						type: mongoose.Types.Decimal128,
						required: true,
						min: 1,
					},
					orderTime: {
						type: Date,
						default: new Date(),
					},
				},
			],
			required: true,
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
