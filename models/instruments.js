const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstrumentSchema = new Schema({
	name: { type: String, required: true, maxLength: 100 },
	type: [{ type: Schema.Types.ObjectId, ref: 'Type', required: true }],
	category: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
	brand: { type: String },
	description: { type: String },
	price: { type: Number, required: true },
	inStock: {
		type: String,
		required: true,
		enum: ['Yes', 'No', 'Check back in: '],
		default: 'Yes',
	},
	backInStock: { type: Date },
});

InstrumentSchema.virtual('url').get(function () {
	return `/store/${this._id}`;
});

module.exports = mongoose.model('Instrument', InstrumentSchema);
