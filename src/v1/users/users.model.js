const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		products: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema.virtual('virtualPopulate', {
	ref: 'Product',
	localField: 'createdAt',
	foreignField: 'createdAt',
	justOne: true,
});

// can create own method that will be reuse multiple times
userSchema.statics.findUserDetail = async function (data) {
	// aggregate will not transform the data (if any)
	const result = await this.aggregate([
		{ $match: { username: data.username } },
		{
			$lookup: {
				from: 'products',
				localField: 'products',
				foreignField: '_id',
				as: 'products',
			},
		},
		{ $project: { __v: 0, 'products.__v': 0 } },
		{ $unwind: { path: '$products', preserveNullAndEmptyArrays: true } }, // deconstruct into object
	]);
	// aggregate always return in array
	return result[0];
};

module.exports = mongoose.model('User', userSchema);
