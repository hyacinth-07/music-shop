const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const InstrumentSchema = new Schema({
	name: { type: String, required: true, maxLength: 100 },
	category: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
	type: [{ type: Schema.Types.ObjectId, ref: 'Type', required: true }],
	brand: { type: String },
	description: { type: String },
	price: { type: Number, required: true },
	inStock: {
		type: String,
		required: true,
		enum: ['Yes', 'No'],
		default: 'Yes',
	},
	backInStock: { type: Date },
});

InstrumentSchema.virtual('url').get(function () {
	return `/store/instruments/${this._id}`;
});

InstrumentSchema.virtual('date_form').get(function () {
	return DateTime.fromJSDate(this.backInStock).toFormat('yyyy-mm-dd');
});

module.exports = mongoose.model('Instrument', InstrumentSchema);
