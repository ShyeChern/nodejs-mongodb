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
});

// can create own method that will be reuse multiple times
userSchema.statics.findUserDetail = function (data) {
	let user = this.findOne({ username: data.username }).lean();
	let userPopulateProduct = this.findOne({ username: data.username }).populate('products').lean();

	return Promise.all([user, userPopulateProduct]);
};

module.exports = mongoose.model('User', userSchema);
